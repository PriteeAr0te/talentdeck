import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(_, file) => {
        let folder = "talentDeck";
        if(file.fieldname === 'profilePictre'){
            folder = "talentDeck/profilePicture";
        } else if(file.fieldname === 'projectImages'){
            folder = "talentDeck/projectImages";
        }

        return {
            folder,
            allowed_format : ['jpg', 'png', 'jpeg', 'webp'], 
            public_id : `${Date.now()}-${file.originalname}`
        }
    }
});

export {cloudinary, storage}