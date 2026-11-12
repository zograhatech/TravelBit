const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma_node.json', 'utf8'));
const root = data.nodes['205:6791'].document;

function getRGBA(c) {
  if (!c) return null;
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = c.a !== undefined ? c.a : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function dumpHierarchy(node, depth = 0) {
  const indent = '  '.repeat(depth);
  let extra = '';
  if (node.type === 'TEXT') {
    const textStyle = node.style || {};
    extra = ` [TEXT: "${node.characters.replace(/\n/g, '\\n')}"] (${textStyle.fontFamily || ''} ${textStyle.fontWeight || ''} ${textStyle.fontSize || ''}px)`;
  } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'INSTANCE') {
    if (node.layoutMode) {
      extra = ` [Layout: ${node.layoutMode}, gap: ${node.itemSpacing || 0}, p: ${node.paddingTop || 0}/${node.paddingRight || 0}/${node.paddingBottom || 0}/${node.paddingLeft || 0}]`;
    }
  }
  console.log(`${indent}- ${node.name} (${node.type}, id: ${node.id})${extra}`);
  if (node.children && depth < 4) {
    node.children.forEach(c => dumpHierarchy(c, depth + 1));
  }
}

console.log('=== ROOT SECTIONS ===');
root.children.forEach((c, i) => {
  console.log(`\n--- Root Child [${i}]: ${c.name} (${c.type}, y: ${c.absoluteBoundingBox?.y}, h: ${c.absoluteBoundingBox?.height}) ---`);
  dumpHierarchy(c, 1);
});
