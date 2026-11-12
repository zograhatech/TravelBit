const fs = require('fs');
const path = require('path');
const https = require('https');

const mapped = JSON.parse(fs.readFileSync('mapped_images.json', 'utf8'));
const targetDir = path.join(__dirname, '..', 'public', 'images', 'figma');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// deduplicate by imageRef
const uniqueMap = new Map();
for (const item of mapped) {
  if (item.imageRef && item.url && !uniqueMap.has(item.imageRef)) {
    // create clean filename
    const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `${cleanName}_${item.imageRef.slice(0, 8)}.png`;
    uniqueMap.set(item.imageRef, {
      ...item,
      localFilename: filename,
      localPath: path.join(targetDir, filename),
      publicUrl: `/images/figma/${filename}`
    });
  }
}

console.log(`Downloading ${uniqueMap.size} unique images...`);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed with status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const downloadEntries = Array.from(uniqueMap.values());
  let count = 0;
  for (const entry of downloadEntries) {
    try {
      await downloadFile(entry.url, entry.localPath);
      count++;
      console.log(`[${count}/${downloadEntries.length}] Downloaded ${entry.localFilename}`);
    } catch (err) {
      console.error(`Error downloading ${entry.imageRef}:`, err.message);
    }
  }

  // Save the manifest of imageRef -> local public path
  const manifest = {};
  for (const [ref, info] of uniqueMap.entries()) {
    manifest[ref] = info.publicUrl;
  }
  fs.writeFileSync('image_manifest.json', JSON.stringify(manifest, null, 2));
  console.log('All downloads complete. Manifest saved to image_manifest.json');
}

run();
