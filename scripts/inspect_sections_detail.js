const fs = require('fs');
const summary = JSON.parse(fs.readFileSync('page_sections_summary.json', 'utf8'));

// Sort by box.y
summary.sort((a, b) => (a.box?.y || 0) - (b.box?.y || 0));

summary.forEach(s => {
  console.log(`\n======================================================`);
  console.log(`SECTION: [${s.index}] ${s.name} | y: ${s.box?.y}, h: ${s.box?.height}, w: ${s.box?.width}`);
  console.log(`Fills:`, s.fills);
  console.log(`Images (${s.images.length}):`, s.images.map(img => `${img.name} -> ${img.src} (${img.box?.width}x${img.box?.height})`));
  console.log(`Texts (${s.texts.length}):`);
  const uniqueTexts = [];
  s.texts.forEach(t => {
    const trimmed = t.text.trim();
    if (trimmed && !uniqueTexts.some(u => u.text === trimmed)) {
      uniqueTexts.push(t);
    }
  });
  uniqueTexts.forEach(t => {
    console.log(`  - "${t.text.replace(/\n/g, ' ')}" [${t.fontFamily} ${t.fontWeight} ${t.fontSize}px color: ${t.color}]`);
  });
});
