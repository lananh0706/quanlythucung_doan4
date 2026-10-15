const { toQR } = require('toqr');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const expoUrl = `exp://${localIp}:8081`;
const webUrl = `http://${localIp}:8081`;
const adminUrl = `http://${localIp}:8081/admin`;

console.log('Local IP:', localIp);
console.log('Expo URL:', expoUrl);

const grid = toQR(expoUrl);
const size = Math.sqrt(grid.length);
const scale = 10;
const border = 4;
const totalDim = (size + border * 2) * scale;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalDim} ${totalDim}" width="320" height="320">\n`;
svg += `  <rect width="100%" height="100%" fill="#ffffff" rx="16"/>\n`;

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (grid[y * size + x]) {
      const rx = (x + border) * scale;
      const ry = (y + border) * scale;
      svg += `  <rect x="${rx}" y="${ry}" width="${scale}" height="${scale}" fill="#0f172a"/>\n`;
    }
  }
}
svg += '</svg>';

const projectSvg = path.join(__dirname, '..', 'expo_qr.svg');
fs.writeFileSync(projectSvg, svg, 'utf8');

const artifactDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/4f55760d-1adc-43f6-a8d8-0b1488b248a4';
try {
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(path.join(artifactDir, 'expo_qr.svg'), svg, 'utf8');
} catch (e) {}

// Also create an ASCII QR representation for terminal / markdown
// In QR: 1 is black, 0 is white.
// In dark terminal: █ is white, space is black. So invert: 0 -> █, 1 -> space, or use black/white unicode squares
let asciiBlocks = '';
const bPad = 2;
for (let y = -bPad; y < size + bPad; y += 2) {
  let line = '';
  for (let x = -bPad; x < size + bPad; x++) {
    const top = (y >= 0 && y < size && x >= 0 && x < size) ? grid[y * size + x] : 0;
    const bottom = (y + 1 >= 0 && y + 1 < size && x >= 0 && x < size) ? grid[(y + 1) * size + x] : 0;
    // 0 = white, 1 = black
    // If top is white (0) and bottom is white (0) -> █
    // If top is black (1) and bottom is black (1) -> ' '
    // If top is black (1) and bottom is white (0) -> ▄
    // If top is white (0) and bottom is black (1) -> ▀
    if (!top && !bottom) line += '█';
    else if (top && !bottom) line += '▄';
    else if (!top && bottom) line += '▀';
    else line += ' ';
  }
  asciiBlocks += line + '\n';
}

console.log('\n--- ASCII QR CODE (Scan directly with Expo Go / Camera) ---');
console.log(asciiBlocks);
console.log('-----------------------------------------------------------');
