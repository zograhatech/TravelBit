const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma_node.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('image_manifest.json', 'utf8'));
const root = data.nodes['205:6791'].document;

function parseColor(fill) {
  if (!fill || !fill.color) return null;
  const { r, g, b, a } = fill.color;
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  const opacity = fill.opacity !== undefined ? fill.opacity : (a !== undefined ? a : 1);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function summarizeNode(node) {
  const texts = [];
  const images = [];
  
  function walk(n) {
    if (n.type === 'TEXT') {
      texts.push({
        text: n.characters,
        fontSize: n.style?.fontSize,
        fontWeight: n.style?.fontWeight,
        fontFamily: n.style?.fontFamily,
        lineHeightPx: n.style?.lineHeightPx,
        color: n.fills?.[0] ? parseColor(n.fills[0]) : null
      });
    }
    if (n.fills) {
      for (const f of n.fills) {
        if (f.type === 'IMAGE' && f.imageRef) {
          images.push({
            id: n.id,
            name: n.name,
            imageRef: f.imageRef,
            src: manifest[f.imageRef],
            box: n.absoluteBoundingBox
          });
        }
      }
    }
    if (n.children) {
      n.children.forEach(walk);
    }
  }
  walk(node);
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    box: node.absoluteBoundingBox,
    fills: node.fills?.map(parseColor).filter(Boolean),
    texts,
    images
  };
}

const summary = [];
const body = root.children[0];
body.children.forEach((c, idx) => {
  summary.push({
    index: idx,
    ...summarizeNode(c)
  });
});

// Also root children 1 to 6
for (let i = 1; i < root.children.length; i++) {
  summary.push({
    index: `root_${i}`,
    ...summarizeNode(root.children[i])
  });
}

fs.writeFileSync('page_sections_summary.json', JSON.stringify(summary, null, 2));
console.log(`Extracted summary for ${summary.length} sections/components.`);
summary.forEach(s => {
  console.log(`[${s.index}] ${s.name} (y: ${s.box?.y}, h: ${s.box?.height}) - ${s.texts.length} texts, ${s.images.length} images`);
});
