const fs = require('fs');
const path = require('path');

// Image extensions to look for
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG'];

// Read images folder
const imagesDir = path.join(__dirname, 'images');
const files = fs.readdirSync(imagesDir).filter(file => {
    const ext = path.extname(file);
    return imageExtensions.includes(ext);
}).sort();

if (files.length === 0) {
    console.log('No images found in the images folder.');
    process.exit(0);
}

// Generate gallery HTML
let galleryHTML = `                <div id="gallery" class="section">
                    <h2>Gallery</h2>
                    
                    <p>My photography showcase. I took these photos during my adventures.</p>
                    <div class="gallery-container">`;

files.forEach((file, index) => {
    galleryHTML += `
                        <div class="gallery-item">
                            <img src="images/${file}" alt="Photography ${index + 1}" class="gallery-image" loading="lazy">
                            <div class="gallery-overlay"></div>
                        </div>`;
});

galleryHTML += `
                    </div>`;

// Read current HTML file
const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Find and replace the gallery section
const galleryStart = htmlContent.indexOf('<div id="gallery" class="section">');
const lightboxStart = htmlContent.indexOf('<!-- Lightbox modal -->');

if (galleryStart === -1 || lightboxStart === -1) {
    console.error('Could not find gallery section in index.html');
    process.exit(1);
}

// Extract everything after the closing </div> of gallery-container
const beforeGallery = htmlContent.substring(0, galleryStart);
const afterGallery = htmlContent.substring(lightboxStart);

// Write updated HTML
const updatedHTML = beforeGallery + galleryHTML + '\n                    ' + afterGallery;
fs.writeFileSync(htmlPath, updatedHTML);

console.log(`✓ Gallery updated! Found ${files.length} image(s):`);
files.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
});
