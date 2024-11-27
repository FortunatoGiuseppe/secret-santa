const express = require('express');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

cloudinary.config({
  cloud_name: 'dyphfsvio',
  api_key: '626595111991776',
  api_secret: 'oGFLTcpZqLkVWjw6bEPhF2a4M70'
});

app.post('/delete-image', async (req, res) => {
  const { public_id } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
