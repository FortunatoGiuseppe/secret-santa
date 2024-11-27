const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cloudinary = require("cloudinary").v2;

admin.initializeApp();

cloudinary.config({
  cloud_name: "dyphfsvio",
  api_key: "626595111991776",
  api_secret: "oGFLTcpZqLkVWjw6bEPhF2a4M70",
});

exports.deleteImage = functions.https.onRequest(async (req, res) => {
  const {publicId} = req.body;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.json(result);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
