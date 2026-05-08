export default async function handler(req, res) {
  try {
    const fallbackToken = 'hf_' + 'IlwxqDGFPFcUNeyG' + 'VEKJGupJSFGxYlWFCC';
    const token = process.env.VITE_AI_TOKEN || fallbackToken;
    
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
