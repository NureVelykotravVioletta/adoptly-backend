import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const addAnimalImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const animal = await prisma.animal.findUnique({
            where: { id },
        });

        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const image = await prisma.animalImage.create({
            data: {
                animalId: id,
                imageUrl: result.secure_url,
                publicId: result.public_id,
            },
        });

        res.status(201).json(image);
    } catch (error) {
        next(error);
    }
};

import cloudinary from "../lib/cloudinary.js";

export const deleteAnimalImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        const image = await prisma.animalImage.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            return res.status(404).json({ message: "Animal image not found" });
        }

        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await prisma.animalImage.delete({
            where: { id: imageId },
        });

        res.json({ message: "Animal image deleted successfully" });
    } catch (error) {
        next(error);
    }
};