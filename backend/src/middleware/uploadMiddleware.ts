import multer from "multer";
import { storage } from "../utils/cloudinary";

export const upload = multer({storage})