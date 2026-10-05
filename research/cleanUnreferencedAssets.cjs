const fs = require('fs');
const path = require('path');

const allowedImages = new Set([
  'bharati-station.jpg',
  'maitri-station.jpg',
  'himadri-station.JPG',
  'dakshin-gangotri.jpg',
  'orv-sagar-kanya.jpg',
  'salix-polaris-arctic-willow.jpg',
  'schirmacher-oasis.jpg'
]);

const allowedVideos = new Set([
  'polar-hero-bg.webm',
  'polar-hero-bg.mp4',
  'polar-hero-poster.jpg'
]);

const imagesDir = path.join(__dirname, '../public/images');
const videosDir = path.join(__dirname, '../public/videos');

const deletedImages = [];
fs.readdirSync(imagesDir).forEach(f => {
  if (!allowedImages.has(f)) {
    fs.unlinkSync(path.join(imagesDir, f));
    deletedImages.push(f);
  }
});

const deletedVideos = [];
fs.readdirSync(videosDir).forEach(f => {
  if (!allowedVideos.has(f)) {
    fs.unlinkSync(path.join(videosDir, f));
    deletedVideos.push(f);
  }
});

console.log(`Deleted ${deletedImages.length} unreferenced files from public/images:`);
deletedImages.forEach(f => console.log(`  - ${f}`));

console.log(`\nDeleted ${deletedVideos.length} unreferenced files from public/videos:`);
deletedVideos.forEach(f => console.log(`  - ${f}`));

console.log(`\nRemaining in public/images (${fs.readdirSync(imagesDir).length}):`, fs.readdirSync(imagesDir));
console.log(`Remaining in public/videos (${fs.readdirSync(videosDir).length}):`, fs.readdirSync(videosDir));
