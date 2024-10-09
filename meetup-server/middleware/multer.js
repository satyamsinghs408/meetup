const multer = require("multer");
const { v4: uuidv4 } = require("uuid");


const generateUUID = () => {
  return uuidv4();
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,"./public")
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${generateUUID()}-${file.originalname}`);
    }
});

const upload = multer({ storage:storage });

module.exports = upload;