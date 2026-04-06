import cloudinary from "../lib/cloudinary.js";

export const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "adoptly" }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
            .end(fileBuffer);
    });
};