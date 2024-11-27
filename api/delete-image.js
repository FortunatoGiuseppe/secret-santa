const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyphfsvio',
  api_key: '626595111991776',
  api_secret: 'oGFLTcpZqLkVWjw6bEPhF2a4M70'
});

module.exports = async (req, res) => {
  const { publicId } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
