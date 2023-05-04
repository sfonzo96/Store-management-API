import multer from 'multer';
import CustomError from '../utils/CustomError.js';
import path from 'path';

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

const uploadID = multer({ storage: idStorage }).single('idDoc');

const uploadAdress = multer({ storage: addressStorage }).single('addressDoc');

const uploadStatus = multer({ storage: statusStorage }).single('statusDoc');

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
