import multer from "multer";
import { v4 as uuid } from "uuid";
import path from 'path';

export const uploadSingle = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
      const imageExtension = path.extname(file.originalname);
      const newFilename = `${uuid().toString()}${imageExtension}`;
      cb(null, `${newFilename}`);
    },
  }),
});

export const uploadBlogImage = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./public/blogs/images");
      },
      filename: (req, file, cb) => {
        const imageExtension = path.extname(file.originalname);
        const newFilename = `${uuid().toString()}${imageExtension}`;
        cb(null, `${newFilename}`);
      },
    }),
  });
