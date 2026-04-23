import { readFileSync, writeFileSync } from 'node:fs';

const demoPath = 'webmcp-veritrax-demo.html';
const deckPath = 'webmcp-pharma-10min.html';
const outPath  = 'webmcp-pharma-10min-bundled.html';

const demoRaw = readFileSync(demoPath, 'utf8');
const deckRaw = readFileSync(deckPath, 'utf8');

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
