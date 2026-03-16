const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.extractFrames = (videoPath) => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(videoPath, path.extname(videoPath));
    const outputDir = path.dirname(videoPath);
    // 1 frame every 2 seconds
    const filePattern = `${filename}_frame_%04d.jpg`;
    const outputPathPattern = path.join(outputDir, filePattern);

    ffmpeg(videoPath)
      .on('end', () => {
        // Find extracted frames
        const files = fs.readdirSync(outputDir);
        const frames = files
          .filter(f => f.startsWith(`${filename}_frame_`))
          .map(f => path.join(outputDir, f));
        
        // Limit to max 10 frames to avoid long processing and API timeouts
        let selectedFrames = frames;
        if (frames.length > 10) {
          selectedFrames = [];
          const step = Math.ceil(frames.length / 10);
          for (let i = 0; i < frames.length; i += step) {
            selectedFrames.push(frames[i]);
          }
          // Cleanup unused frames immediately
          frames.forEach(f => {
            if (!selectedFrames.includes(f) && fs.existsSync(f)) {
              fs.unlinkSync(f);
            }
          });
        }
        
        resolve(selectedFrames);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .outputOptions(['-vf fps=1/2'])
      .output(outputPathPattern)
      .run();
  });
};
