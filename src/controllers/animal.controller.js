import { prisma } from "../lib/prisma.js";
import {
    normalizeAnimalGender,
    normalizeAnimalType,
} from "../utils/animalEnums.js";

export const getAllAnimals = async (req, res, next) => {
    try {
        const {
            type,
            category,
            gender,
            city,
            status,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const animalType = normalizeAnimalType(category ?? type);
        const animalGender = normalizeAnimalGender(gender);

        const where = {
            shelter: city
                ? {
                      is: {
                          city: {
                              is: {
                                  name: {
                                      contains: city,
                                      mode: "insensitive",
                                  },
                              },
                          },
                      },
                  }
                : { isNot: null },
            ...(animalType && { type: animalType }),
            ...(animalGender && { gender: animalGender }),
            ...(status && { status }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { breed: { name: { contains: search, mode: "insensitive" } } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const [animals, total] = await Promise.all([
            prisma.animal.findMany({
                where,
                include: {
                    images: true,
                    breed: true,
                    shelter: { include: { city: true } },
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
                breed: true,
                shelter: { include: { city: true } },
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

        const shelter = await prisma.shelter.findUnique({
            where: { id: shelterId },
            select: { id: true },
        });

        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        const animal = await prisma.animal.create({
            data: {
                name,
                type,
                gender,
                age,
                healthStatus,
                description,
                shelterId,
                ...(breed && {
                    breed: {
                        connectOrCreate: {
                            where: { name: breed },
                            create: { name: breed },
                        },
                    },
                }),
            },
            include: { breed: true, shelter: { include: { city: true } } },
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
        const { shelterId, breed, ...rest } = req.body;

        let shelterData = {};

        if (shelterId !== undefined) {
            const shelter = await prisma.shelter.findUnique({
                where: { id: shelterId },
                select: { id: true },
            });

            if (!shelter) {
                return res.status(404).json({ message: "Shelter not found" });
            }

            shelterData = { shelterId };
        }

        const animal = await prisma.animal.update({
            where: { id },
            data: {
                ...rest,
                ...shelterData,
                ...(breed !== undefined && {
                    breed: breed
                        ? {
                              connectOrCreate: {
                                  where: { name: breed },
                                  create: { name: breed },
                              },
                          }
                        : { disconnect: true },
                }),
            },
            include: { breed: true, shelter: { include: { city: true } } },
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

export const removeAnimalFromShelter = async (req, res, next) => {
    try {
        const { shelterId, animalId } = req.params;

        const animal = await prisma.animal.findFirst({
            where: {
                id: animalId,
                shelterId,
            },
        });

        if (!animal) {
            return res.status(404).json({ message: "Animal not found in this shelter" });
        }

        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                shelter: {
                    disconnect: true,
                },
            },
            include: {
                images: true,
                breed: true,
                shelter: { include: { city: true } },
            },
        });

        res.json({
            message: "Animal removed from shelter successfully",
            animal: updatedAnimal,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
