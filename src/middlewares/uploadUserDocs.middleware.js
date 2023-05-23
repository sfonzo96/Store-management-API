import multer from 'multer';
import CustomError from '../utils/CustomError.js';
import path from 'path';

// Saves the ID Doc in uploads/idDocs
const idStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/idDocs');
  },
  filename: function (req, file, cb) {
    const { userID } = req.params;
    const extension = path.extname(file.originalname);
    const newFilename = `${userID}_idDoc${extension}`;
    cb(null, newFilename);
  },
});

// Saves the Address Doc in uploads/addressesDoc
const addressStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/addressesDoc');
  },
  filename: function (req, file, cb) {
    const { userID } = req.params;
    const extension = path.extname(file.originalname);
    const newFilename = `${userID}_adressDoc${extension}`;
    cb(null, newFilename);
  },
});

// Saves the Status Doc in uploads/statusDoc
const statusStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/statusDoc');
  },
  filename: function (req, file, cb) {
    const { userID } = req.params;
    const extension = path.extname(file.originalname);
    const newFilename = `${userID}_statusDoc${extension}`;
    cb(null, newFilename);
  },
});

// Defines the upload multer middleware
const uploadID = multer({ storage: idStorage }).single('idDoc');
const uploadAdress = multer({ storage: addressStorage }).single('addressDoc');
const uploadStatus = multer({ storage: statusStorage }).single('statusDoc');

// Checks the type of file to upload
const upload = (req, res, next) => {
  const { type } = req.params;

  switch (type) {
    case 'idDoc':
      uploadID(req, res, next);
      break;
    case 'addressDoc':
      uploadAdress(req, res, next);
      break;
    case 'statusDoc':
      uploadStatus(req, res, next);
      break;
    default:
      return new CustomError('BAD_REQUEST', 'Invalid document type');
  }
};

export default upload;
