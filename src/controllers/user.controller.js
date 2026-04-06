import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name !== undefined && { name }),
                ...(phone !== undefined && { phone }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const uploadMyAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                avatarUrl: result.secure_url,
                avatarPublicId: result.public_id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteMyAvatar = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                avatarUrl: null,
                avatarPublicId: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            message: "Avatar deleted successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};