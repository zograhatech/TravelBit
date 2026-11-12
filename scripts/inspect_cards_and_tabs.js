const fs = require('fs');
const cleanData = JSON.parse(fs.readFileSync('clean_sections.json', 'utf8'));

// Find Frame 4 (Destinations)
const frame4 = cleanData.find(d => d.name === 'Frame 4');
console.log('=== DESTINATIONS SECTION (Frame 4) ===');
console.log('Images:', frame4.images);
console.log('Texts:', frame4.texts);

// Find Frame 13 (Certifications/Partners)
const frame13 = cleanData.find(d => d.name === 'Frame 13');
console.log('\n=== FRAME 13 ===');
console.log('Images:', frame13.images);
console.log('Texts:', frame13.texts);

// Find Container at y=9583 (Testimonials)
const testimonials = cleanData.find(d => d.y === 9583);
console.log('\n=== TESTIMONIALS SECTION (y=9583) ===');
console.log('Images:', testimonials.images);
console.log('Texts:', testimonials.texts);
