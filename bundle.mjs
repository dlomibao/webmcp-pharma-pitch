import { readFileSync, writeFileSync } from 'node:fs';

const demoPath = 'webmcp-veritrax-demo.html';
const deckPath = 'webmcp-pharma-10min.html';
const teamPrimerPath = 'team-primer.md';
const clientPrimerPath = 'client-primer.md';
const outPath  = 'webmcp-pharma-10min-bundled.html';

const demoRaw = readFileSync(demoPath, 'utf8');
const deckRaw = readFileSync(deckPath, 'utf8');
const teamPrimerMd = readFileSync(teamPrimerPath, 'utf8');
const clientPrimerMd = readFileSync(clientPrimerPath, 'utf8');

// ─── Minimal markdown → HTML converter ──────────────────────────────────────
// Handles: # H1-H6, **bold**, *italic*, `code`, [link](url), > blockquote,
// --- hr, - and 1. lists, | tables |, paragraphs. Sufficient for the primer
// files. NOT a general-purpose markdown parser.
function mdToHtml(md) {
  // Escape HTML entities first
  md = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Restore > at line starts (for blockquotes — & gt; came from raw >)
  md = md.replace(/^&gt;/gm, '>');

  function inline(s) {
    // links first
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // bold
    s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    // italic — match * not adjacent to other *
    s = s.replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');
    // inline code
    s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
    return s;
  }

  const lines = md.split('\n');
  const out = [];
  let para = [];
  let inUl = false, inOl = false, inBq = false, inTable = false;

  function flushPara() {
    if (para.length) {
      out.push('<p>' + inline(para.join(' ')) + '</p>');
      para = [];
    }
  }
  function closeBlocks() {
    flushPara();
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
    if (inBq) { out.push('</blockquote>'); inBq = false; }
    if (inTable) { out.push('</tbody></table>'); inTable = false; }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;

    // Blank line
    if (!line.trim()) { closeBlocks(); continue; }

    // Heading
    if (m = line.match(/^(#{1,6})\s+(.+)$/)) {
      closeBlocks();
      const lvl = m[1].length;
      out.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`);
      continue;
    }

    // HR
    if (line.match(/^---+$/)) { closeBlocks(); out.push('<hr>'); continue; }

    // Blockquote
    if (m = line.match(/^>\s?(.*)$/)) {
      flushPara();
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (inTable) { out.push('</tbody></table>'); inTable = false; }
      if (!inBq) { out.push('<blockquote>'); inBq = true; }
      if (m[1].trim()) {
        out.push('<p>' + inline(m[1]) + '</p>');
      }
      continue;
    }
    if (inBq) { out.push('</blockquote>'); inBq = false; }

    // Table — header row followed by separator
    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      const next = lines[i + 1];
      if (!inTable && next && next.match(/^\s*\|[\s\-:|]+\|\s*$/)) {
        flushPara();
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (inOl) { out.push('</ol>'); inOl = false; }
        out.push('<table><thead><tr>');
        cells.forEach(c => out.push('<th>' + inline(c) + '</th>'));
        out.push('</tr></thead><tbody>');
        inTable = true;
        i++; // skip separator
        continue;
      } else if (inTable) {
        out.push('<tr>');
        cells.forEach(c => out.push('<td>' + inline(c) + '</td>'));
        out.push('</tr>');
        continue;
      }
    }
    if (inTable) { out.push('</tbody></table>'); inTable = false; }

    // Bullet list
    if (m = line.match(/^[-*]\s+(.+)$/)) {
      flushPara();
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push('<li>' + inline(m[1]) + '</li>');
      continue;
    }

    // Numbered list
    if (m = line.match(/^\d+\.\s+(.+)$/)) {
      flushPara();
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push('<li>' + inline(m[1]) + '</li>');
      continue;
    }
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }

    // Default: paragraph line (accumulate)
    para.push(line.trim());
  }
  closeBlocks();
  return out.join('\n');
}

const teamPrimerHtml = mdToHtml(teamPrimerMd);
const clientPrimerHtml = mdToHtml(clientPrimerMd);

// Base64-encode the demo. This sidesteps every HTML/JS escaping pitfall —
// the encoded blob has no <, >, /, or quote characters at all, so it can
// be embedded inside any markup or string literal without conflict.
const demoB64 = Buffer.from(demoRaw, 'utf8').toString('base64');

const iframeRegex = /<iframe\s+src="webmcp-veritrax-demo\.html"[^>]*><\/iframe>/i;
if (!iframeRegex.test(deckRaw)) {
  console.error('ERROR: could not find demo iframe in deck — abort.');
  process.exit(1);
}

const replacement = `<iframe id="demoFrame" title="WebMCP Veritrax demo" loading="lazy"></iframe>`;
let merged = deckRaw.replace(iframeRegex, replacement);

// Inject pre-rendered primer HTML into the placeholder asides
merged = merged.replace('<!-- TEAM_PRIMER_HTML -->', teamPrimerHtml);
merged = merged.replace('<!-- CLIENT_PRIMER_HTML -->', clientPrimerHtml);

// Loader injects the decoded demo HTML into the iframe via srcdoc the first
// time the demo slide becomes visible.
const bootstrap = `
<script>
  (function () {
    const DEMO_B64 = "${demoB64}";
    let loaded = false;
    function loadDemo() {
      if (loaded) return;
      const frame = document.getElementById('demoFrame');
      if (!frame) return;
      // Decode base64 → UTF-8 string. atob returns binary string; we round-trip
      // through TextDecoder to handle multi-byte characters correctly.
      const bin = atob(DEMO_B64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const html = new TextDecoder('utf-8').decode(bytes);
      frame.srcdoc = html;
      loaded = true;
    }
    const demoSlide = document.querySelector('.slide[data-role="demo"]');
    if (demoSlide) {
      const obs = new MutationObserver(() => {
        if (demoSlide.classList.contains('active')) loadDemo();
      });
      obs.observe(demoSlide, { attributes: true, attributeFilter: ['class'] });
      if (demoSlide.classList.contains('active')) loadDemo();
    }
  })();
</script>
`;

merged = merged.replace('</body>', bootstrap + '\n</body>');

writeFileSync(outPath, merged, 'utf8');
console.log('Wrote ' + outPath + ' (' + merged.length + ' bytes)');
