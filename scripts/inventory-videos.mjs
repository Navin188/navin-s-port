import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const ffprobePath = ffprobeInstaller.path;
const ffmpegPath = ffmpegInstaller.path;

const BASE_DIRS = [
  path.resolve('src/assets/ReelSecion-videos'),
  path.resolve('src/assets/ReelSection-videos'),
];

let reelDir = BASE_DIRS.find(d => fs.existsSync(d));

if (!reelDir) {
  console.error('Could not find ReelSecion-videos or ReelSection-videos folder');
  process.exit(1);
}

console.log('Using Reel Directory:', reelDir);

const categories = ['corporateand-fun', 'poetryand-feeling'];

const inventory = [];

for (const cat of categories) {
  const catPath = path.join(reelDir, cat);
  if (!fs.existsSync(catPath)) {
    console.warn(`Category path does not exist: ${catPath}`);
    continue;
  }

  const files = fs.readdirSync(catPath).filter(f => /\.(mp4|mov|webm|m4v)$/i.test(f));

  for (const file of files) {
    const fullPath = path.join(catPath, file);
    const stats = fs.statSync(fullPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    try {
      const probeOutput = execSync(
        `"${ffprobePath}" -v quiet -print_format json -show_format -show_streams "${fullPath}"`,
        { encoding: 'utf-8' }
      );
      const data = JSON.parse(probeOutput);
      const vStream = data.streams.find(s => s.codec_type === 'video');
      const aStream = data.streams.find(s => s.codec_type === 'audio');

      let fps = 'unknown';
      if (vStream && vStream.r_frame_rate) {
        const [num, den] = vStream.r_frame_rate.split('/').map(Number);
        fps = den ? (num / den).toFixed(2) : vStream.r_frame_rate;
      }

      inventory.push({
        category: cat,
        filename: file,
        sizeBytes: stats.size,
        sizeMB: `${sizeMB} MB`,
        format: data.format.format_name,
        duration: data.format.duration ? `${parseFloat(data.format.duration).toFixed(2)}s` : 'unknown',
        durationSec: parseFloat(data.format.duration || 0),
        resolution: vStream ? `${vStream.width}x${vStream.height}` : 'unknown',
        width: vStream?.width,
        height: vStream?.height,
        fps,
        videoCodec: vStream?.codec_name || 'none',
        pixFmt: vStream?.pix_fmt || 'unknown',
        audioCodec: aStream?.codec_name || 'none',
        bitrateKbps: data.format.bit_rate ? Math.round(data.format.bit_rate / 1000) : 'unknown',
      });
    } catch (err) {
      console.error(`Error probing ${file}:`, err.message);
      inventory.push({
        category: cat,
        filename: file,
        sizeBytes: stats.size,
        sizeMB: `${sizeMB} MB`,
        error: err.message,
      });
    }
  }
}

console.log(JSON.stringify(inventory, null, 2));
fs.writeFileSync('scripts/video-inventory.json', JSON.stringify(inventory, null, 2));
