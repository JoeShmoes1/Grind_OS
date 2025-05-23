import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Build the React app
console.log('Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Copy static HTML files to dist
console.log('Copying static HTML files...');
const staticFiles = [
  'landing.html',
  'about.html',
  'careers.html',
  'blog.html',
  'contact.html',
  'terms.html',
  'privacy.html',
  'cookies.html',
  'logo.png',
  '404.html'
];

staticFiles.forEach(file => {
  const srcPath = path.join('public', file);
  const destPath = path.join('dist', file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file}`);
  }
});

// Create index.html as the default landing page (copy from landing.html)
const landingPath = path.join('dist', 'landing.html');
const indexPath = path.join('dist', 'index.html');

if (fs.existsSync(landingPath)) {
  // Read the landing.html content
  let landingContent = fs.readFileSync(landingPath, 'utf8');
  
  // Update paths to work with GitHub Pages base path
  landingContent = landingContent.replace(/href="\.\/index\.html#/g, 'href="#');
  landingContent = landingContent.replace(/href="\/([^"]*)">/g, 'href="./$1">');
  
  // Write as index.html
  fs.writeFileSync(indexPath, landingContent);
  console.log('Created index.html from landing.html');
}

console.log('Build complete!');
