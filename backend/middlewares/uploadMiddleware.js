import multer from "multer";

// memory storage (NO FOLDER)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
