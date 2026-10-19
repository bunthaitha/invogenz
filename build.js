import fs from 'fs';
import path from 'path';

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const stat = fs.lstatSync(path.join(from, element));
        if (stat.isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else if (stat.isDirectory()) {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

console.log('Building Invogenz for Cloudflare Pages...');
fs.mkdirSync('dist', { recursive: true });

if (fs.existsSync('index.html')) {
    fs.copyFileSync('index.html', 'dist/index.html');
}

copyFolderSync('css', 'dist/css');
copyFolderSync('js', 'dist/js');

console.log('Invogenz build complete! Output directory: dist/');
