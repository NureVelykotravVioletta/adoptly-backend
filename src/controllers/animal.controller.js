import { prisma } from "../lib/prisma.js";

export const getAllAnimals = async (req, res, next) => {
    try {
        const {
            type,
            gender,
            status,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const where = {
            ...(type && { type }),
            ...(gender && { gender }),
            ...(status && { status }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { breed: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const [animals, total] = await Promise.all([
            prisma.animal.findMany({
                where,
                include: {
                    images: true,
                    shelter: true,
                },
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.animal.count({ where }),
        ]);

        res.json({
            data: animals,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAnimalById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const animal = await prisma.animal.findUnique({
            where: { id },
            include: {
                images: true,
                shelter: true,
            },
        });

        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json(animal);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const createAnimal = async (req, res, next) => {
    try {
        const {
            name,
            type,
            gender,
            age,
            breed,
            healthStatus,
            description,
            shelterId,
        } = req.body;

        const animal = await prisma.animal.create({
            data: {
                name,
                type,
                gender,
                age,
                breed,
                healthStatus,
                description,
                shelterId,
            },
        });

        res.status(201).json(animal);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const updateAnimal = async (req, res, next) => {
    try {
        const { id } = req.params;

        const animal = await prisma.animal.update({
            where: { id },
            data: req.body,
        });

        res.json(animal);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteAnimal = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.animal.delete({
            where: { id },
        });

        res.json({ message: "Animal deleted successfully" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};