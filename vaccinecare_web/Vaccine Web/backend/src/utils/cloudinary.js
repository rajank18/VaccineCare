import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET
})

export const uploadMedia = async (file) => {
   try {
      const uplodeREesponse = await cloudinary.uploader.upload(file, {
         resource_type: "auto"
      });
      return uplodeREesponse;

   } catch (e) {
      console.log(e);
   }
}

export const deleteMedia = async (publicid) => {
   try {
      const deleteResponse = await cloudinary.uploader.destroy(publicid);
      return deleteResponse;
   } catch (e) {
      console.log(e);
   }
}
