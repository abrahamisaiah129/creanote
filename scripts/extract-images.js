const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../creanote.html'), 'utf-8');

// The images appear in this order:
// 0, 1, 2, 3: Hero slides (slide-0, slide-1, slide-2, slide-3)
// 4, 5, 6: Top on the list cards (top-card-1, top-card-2, top-card-3)
// 7: Quote avatar (qavatar)
// 8, 9: Post thumbnails (post-1, post-2)

const names = [
  'hero-0.jpg',
  'hero-1.jpg',
  'hero-2.jpg',
  'hero-3.jpg',
  'top-card-1.jpg',
  'top-card-2.jpg',
  'top-card-3.jpg',
  'quote-avatar.jpg',
  'post-1.jpg',
  'post-2.jpg'
];

const matches = [];
const regex = /src="data:image\/(?:png|jpeg|jpg);base64,([^"]+)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push(match[1]);
}

console.log(`Found ${matches.length} base64 images in HTML.`);

const outDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

matches.forEach((base64Data, idx) => {
  const fileName = names[idx] || `image-${idx}.jpg`;
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(path.join(outDir, fileName), buffer);
  console.log(`Saved ${fileName} (${buffer.length} bytes)`);
});
