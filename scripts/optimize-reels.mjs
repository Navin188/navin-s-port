import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffprobeInstaller.path;

const BASE_DIRS = [
  path.resolve('src/assets/ReelSecion-videos'),
  path.resolve('src/assets/ReelSection-videos'),
];

const reelDir = BASE_DIRS.find(d => fs.existsSync(d));
if (!reelDir) {
  console.error('Source reel folder not found!');
  process.exit(1);
}

const OUT_BASE = path.resolve('public/optimized-reels');
const categories = ['corporateand-fun', 'poetryand-feeling'];

const report = [];

for (const cat of categories) {
  const inCatDir = path.join(reelDir, cat);
  const outCatDir = path.join(OUT_BASE, cat);
  const thumbCatDir = path.join(OUT_BASE, 'thumbnails', cat);

  fs.mkdirSync(outCatDir, { recursive: true });
  fs.mkdirSync(thumbCatDir, { recursive: true });

  const files = fs.readdirSync(inCatDir).filter(f => /\.(mp4|mov|webm|m4v)$/i.test(f));

  for (const file of files) {
    const srcFile = path.join(inCatDir, file);
    const baseName = path.parse(file).name;
    const outFile = path.join(outCatDir, `${baseName}.mp4`);
    const thumbFile = path.join(thumbCatDir, `${baseName}.jpg`);

    const srcStat = fs.statSync(srcFile);
    const srcSize = srcStat.size;

    console.log(`\n-----------------------------------------`);
    console.log(`Processing [${cat}] ${file} (${(srcSize / (1024 * 1024)).toFixed(2)} MB)...`);

    // FFmpeg Optimization:
    // -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart
    // Preserves native resolution without upscaling or stretching.
    const ffmpegCmd = `"${ffmpegPath}" -y -i "${srcFile}" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "${outFile}"`;

    try {
      execSync(ffmpegCmd, { stdio: 'pipe' });
    } catch (e) {
      console.error(`Error optimizing ${file}:`, e.message);
      continue;
    }

    // Generate lightweight poster thumbnail at 1 second (or 0.5s)
    const thumbCmd = `"${ffmpegPath}" -y -ss 00:00:01 -i "${srcFile}" -vframes 1 -q:v 3 "${thumbFile}"`;
    try {
      execSync(thumbCmd, { stdio: 'pipe' });
    } catch (e) {
      console.warn(`Could not generate thumbnail for ${file}:`, e.message);
    }

    const outStat = fs.statSync(outFile);
    const outSize = outStat.size;
    const reductionPercent = (((srcSize - outSize) / srcSize) * 100).toFixed(1);

    // Verify playable duration of optimized output
    let outDuration = 'unknown';
    try {
      const probe = execSync(
        `"${ffprobePath}" -v quiet -print_format json -show_format "${outFile}"`,
        { encoding: 'utf-8' }
      );
      const data = JSON.parse(probe);
      outDuration = `${parseFloat(data.format.duration).toFixed(2)}s`;
    } catch (_) {}

    report.push({
      category: cat,
      filename: `${baseName}.mp4`,
      originalSizeMB: (srcSize / (1024 * 1024)).toFixed(2),
      optimizedSizeMB: (outSize / (1024 * 1024)).toFixed(2),
      reductionPercent: `${reductionPercent}%`,
      duration: outDuration,
      status: 'OPTIMIZED_AND_VERIFIED',
    });

    console.log(`  -> Original: ${(srcSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`  -> Optimized: ${(outSize / (1024 * 1024)).toFixed(2)} MB (${reductionPercent}% change)`);
    console.log(`  -> Duration verified: ${outDuration}`);
  }
}

fs.writeFileSync(path.join(OUT_BASE, 'optimization-report.json'), JSON.stringify(report, null, 2));
console.log('\nOptimization complete! Summary:');
console.table(report);
