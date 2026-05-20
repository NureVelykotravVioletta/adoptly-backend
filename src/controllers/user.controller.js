import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const animalInclude = {
    images: true,
    shelter: true,
};

const userSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatarUrl: true,
    role: true,
    likedAnimals: {
        include: {
            animal: {
                include: animalInclude,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    },
    adoptedAnimals: {
        include: animalInclude,
        orderBy: {
            updatedAt: "desc",
        },
    },
    createdAt: true,
    updatedAt: true,
};

const formatLikedAnimal = ({ animal, createdAt }) => ({
    ...animal,
    likedAt: createdAt,
});

const formatUser = ({ likedAnimals = [], ...user }) => ({
    ...user,
    likedAnimals: likedAnimals.map(formatLikedAnimal),
});

export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: userSelect,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(formatUser(user));
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
            select: userSelect,
        });

        res.json(formatUser(updatedUser));
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
            select: userSelect,
        });

        res.json(formatUser(updatedUser));
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
            select: userSelect,
        });

        res.json({
            message: "Avatar deleted successfully",
            user: formatUser(updatedUser),
        });
    } catch (error) {
        next(error);
    }
};

export const getMyLikedAnimals = async (req, res, next) => {
    try {
        const likedAnimals = await prisma.userLikedAnimal.findMany({
            where: { userId: req.user.id },
            include: {
                animal: {
                    include: animalInclude,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(likedAnimals.map(formatLikedAnimal));
    } catch (error) {
        next(error);
    }
};

export const getMyAdoptedAnimals = async (req, res, next) => {
    try {
        const adoptedAnimals = await prisma.animal.findMany({
            where: { adoptedById: req.user.id },
            include: animalInclude,
            orderBy: {
                updatedAt: "desc",
            },
        });

        res.json(adoptedAnimals);
    } catch (error) {
        next(error);
    }
};

export const likeAnimal = async (req, res, next) => {
    try {
        const { animalId } = req.params;

        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
            select: { id: true },
        });

        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        const existingLikedAnimal = await prisma.userLikedAnimal.findUnique({
            where: {
                userId_animalId: {
                    userId: req.user.id,
                    animalId,
                },
            },
            include: {
                animal: {
                    include: animalInclude,
                },
            },
        });

        if (existingLikedAnimal) {
            return res.json(formatLikedAnimal(existingLikedAnimal));
        }

        const likedAnimal = await prisma.userLikedAnimal.create({
            data: {
                userId: req.user.id,
                animalId,
            },
            include: {
                animal: {
                    include: animalInclude,
                },
            },
        });

        res.status(201).json(formatLikedAnimal(likedAnimal));
    } catch (error) {
        next(error);
    }
};

export const unlikeAnimal = async (req, res, next) => {
    try {
        const { animalId } = req.params;

        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
            select: { id: true },
        });

        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        await prisma.userLikedAnimal.deleteMany({
            where: {
                userId: req.user.id,
                animalId,
            },
        });

        res.json({ message: "Animal removed from liked animals" });
    } catch (error) {
        next(error);
    }
};
