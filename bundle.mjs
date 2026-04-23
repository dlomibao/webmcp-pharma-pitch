import { readFileSync, writeFileSync } from 'node:fs';

const demoPath = 'webmcp-veritrax-demo.html';
const deckPath = 'webmcp-pharma-10min.html';
const outPath  = 'webmcp-pharma-10min-bundled.html';

const demoRaw = readFileSync(demoPath, 'utf8');
const deckRaw = readFileSync(deckPath, 'utf8');

// Escape sequences that would break out of a <script type="text/html"> block.
const demoEscaped = demoRaw
  .replace(/<\/script>/gi, '<\\/script>')
  .replace(/<!--/g, '<\\!--');

// Find the iframe in the demo slide and replace it with our embed shell.
const iframeRegex = /<iframe\s+src="webmcp-veritrax-demo\.html"[^>]*><\/iframe>/i;
if (!iframeRegex.test(deckRaw)) {
  console.error('ERROR: could not find demo iframe in deck — abort.');
  process.exit(1);
}

const replacement = `<iframe id="demoFrame" title="WebMCP Veritrax demo" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>`;
let merged = deckRaw.replace(iframeRegex, replacement);

// Inject the demo source as a non-executing script block + a bootstrap script
// just before </body>. The bootstrap injects the demo into the iframe via
// srcdoc the first time the demo slide becomes visible.
const bootstrap = `
<script type="text/html" id="demoSrc">${demoEscaped}</script>
<script>
  (function () {
    let loaded = false;
    function loadDemo() {
      if (loaded) return;
      const frame = document.getElementById('demoFrame');
      const src = document.getElementById('demoSrc');
      if (!frame || !src) return;
      frame.srcdoc = src.textContent;
      loaded = true;
    }
    // Load when demo slide becomes active. Watch for class change on the slide.
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
