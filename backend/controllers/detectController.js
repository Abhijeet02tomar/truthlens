const fs = require('fs');
const { extractFrames } = require('../services/ffmpegService');
const { detectContent } = require('../services/nvidiaService');

exports.handleDetection = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  let result;

  try {
    if (mimeType.startsWith('video/')) {
      const frames = await extractFrames(filePath);
      
      let totalAiProb = 0;
      let totalRealProb = 0;
      let validFrames = 0;

      for (const frame of frames) {
        try {
          const detection = await detectContent(frame);
          totalAiProb += detection.ai_probability;
          totalRealProb += detection.real_probability;
          validFrames++;
        } catch (err) {
          console.error('Frame detection error:', err);
        }
      }

      // Cleanup extracted frames
      for (const frame of frames) {
        if (fs.existsSync(frame)) fs.unlinkSync(frame);
      }

      if (validFrames === 0) {
        throw new Error('Failed to analyze video frames');
      }

      const avgAiProb = totalAiProb / validFrames;
      const avgRealProb = totalRealProb / validFrames;

      result = {
        type: 'video',
        ai_probability: avgAiProb,
        real_probability: avgRealProb,
        verdict: avgAiProb > 0.5 ? 'Likely AI Generated' : 'Likely Real'
      };

    } else if (mimeType.startsWith('image/')) {
      const detection = await detectContent(filePath);
      result = {
        type: 'image',
        ...detection,
        verdict: detection.ai_probability > 0.5 ? 'Likely AI Generated' : 'Likely Real'
      };
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a JPG, PNG, MP4, or MOV file.' });
    }

    // Cleanup uploaded file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json(result);

  } catch (error) {
    console.error('Detection error:', error);
    // Cleanup on error
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Failed to process media file' });
  }
};
