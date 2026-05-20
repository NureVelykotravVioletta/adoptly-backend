import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const addShelterImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const shelter = await prisma.shelter.findUnique({
            where: { id },
        });

        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const image = await prisma.shelterImage.create({
            data: {
                shelterId: id,
                imageUrl: result.secure_url,
                publicId: result.public_id,
            },
        });

        res.status(201).json(image);
    } catch (error) {
        next(error);
    }
};

export const deleteShelterImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;

        const image = await prisma.shelterImage.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            return res.status(404).json({ message: "Shelter image not found" });
        }

        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await prisma.shelterImage.delete({
            where: { id: imageId },
        });

        res.json({ message: "Shelter image deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteShelterImageByUrl = async (req, res, next) => {
    try {
        const { id, url: imageUrl } = req.params;

        const image = await prisma.shelterImage.findFirst({
            where: {
                shelterId: id,
                imageUrl,
            },
        });

        if (!image) {
            return res.status(404).json({ message: "Shelter image not found" });
        }

        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await prisma.shelterImage.delete({
            where: { id: image.id },
        });

        res.json({ message: "Shelter image deleted successfully" });
    } catch (error) {
        next(error);
    }
};
