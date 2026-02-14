import multer from "multer";

// ⭐ STORE FILE IN MEMORY (NOT DISK)
const storage = multer.memoryStorage();

// OPTIONAL: image only filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
