const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

dotenv.config();
// const cloudinary = cloudinaryModule.v2;

console.log(process.env.DB_NAME + "" + process.env.CLOUDINARY_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "image",
        upload_preset: "meetup_app",
        },
      function (error, result) {
        if (error) {
          console.log(error);
           
        } else {
          console.log(result);
        }
      }
    );
    console.log("file is uploaded on cloud", response.url);
    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    // remove saved file as the upload
    return null;
  }
};
module.exports = uploadOnCloudinary;
