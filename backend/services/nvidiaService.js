const axios = require('axios');
const fs = require('fs');

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

exports.detectContent = async (filePath) => {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey) {
    console.warn('NVIDIA_API_KEY is not set. Using mock detection response.');
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Return mock response based on random probability heavily weighted to AI to demonstrate
    const aiProb = 0.75 + (Math.random() * 0.2);
    return {
      ai_probability: parseFloat(aiProb.toFixed(2)),
      real_probability: parseFloat((1 - aiProb).toFixed(2))
    };
  }

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = filePath.split('.').pop().toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const payload = {
      model: 'meta/llama-3.2-90b-vision-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image. Is it real or AI-generated? Return ONLY a JSON object exactly like this: {"ai_probability": 0.00, "real_probability": 0.00}. The probabilities must sum to 1.0. Do not write any other text. Consider any weird artifacts, unnatural lighting, structural inconsistencies, or deepfake tells.'
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl }
            }
          ]
        }
      ],
      max_tokens: 512,
      temperature: 0.2,
      top_p: 0.7
    };

    const response = await axios.post(NVIDIA_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 60000 // 60s timeout for large images as experienced in past conversations
    });

    const content = response.data.choices[0].message.content;
    
    // Attempt to extract JSON from markdown/text blocks
    try {
      const match = content.match(/\{[\s\S]*\}/);
      const jsonStr = match ? match[0] : content;
      const parsed = JSON.parse(jsonStr);
      
      const ai = parseFloat(parsed.ai_probability) || 0;
      const real = parseFloat(parsed.real_probability) || 0;
      
      // Normalize to ensure they sum to 1 in case the model behaves weirdly
      const total = ai + real;
      if (total > 0) {
        return {
          ai_probability: parseFloat((ai / total).toFixed(2)),
          real_probability: parseFloat((real / total).toFixed(2))
        };
      }
      return { ai_probability: 0.5, real_probability: 0.5 };
      
    } catch (parseError) {
      console.error('Failed to parse NVIDIA response:', content);
      return { ai_probability: 0.5, real_probability: 0.5 };
    }

  } catch (error) {
    console.error('NVIDIA API Error:', error.response?.data || error.message);
    throw new Error('Detection failed');
  }
};
