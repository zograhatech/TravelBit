const fs = require('fs');
const summary = JSON.parse(fs.readFileSync('page_sections_summary.json', 'utf8'));

// Filter out root wrappers and sort
summary.sort((a, b) => (a.box?.y || 0) - (b.box?.y || 0));

const cleanData = summary.map(s => {
  const texts = [];
  const seen = new Set();
  s.texts.forEach(t => {
    const trimmed = t.text.trim();
    if (trimmed && trimmed.length > 1 && !seen.has(trimmed)) {
      seen.add(trimmed);
      texts.push({
        text: trimmed,
        font: `${t.fontFamily} ${t.fontWeight} ${t.fontSize}px`,
        color: t.color
      });
    }
  });

  return {
    index: s.index,
    name: s.name,
    y: s.box?.y,
    height: s.box?.height,
    width: s.box?.width,
    images: s.images.map(img => ({
      name: img.name,
      src: img.src,
      width: Math.round(img.box?.width || 0),
      height: Math.round(img.box?.height || 0)
    })),
    texts
  };
});

fs.writeFileSync('clean_sections.json', JSON.stringify(cleanData, null, 2));
console.log('Saved clean_sections.json');
cleanData.forEach(d => {
  console.log(`\n=== [${d.index}] ${d.name} (y=${d.y}, h=${d.height}) ===`);
  console.log('Images:', d.images);
  console.log('Key texts:', d.texts.slice(0, 8));
});
