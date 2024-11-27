const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyphfsvio',
  api_key: '626595111991776',
  api_secret: 'oGFLTcpZqLkVWjw6bEPhF2a4M70'
});

exports.handler = async (event, context) => {
  const { publicId } = JSON.parse(event.body);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
