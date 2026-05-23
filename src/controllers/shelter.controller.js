import { prisma } from "../lib/prisma.js";

export const getAllShelters = async (req, res, next) => {
    try {
        const {
            search,
            address,
            city,
            page = 1,
            limit = 10,
        } = req.query;

        const currentPage = Number(page);
        const currentLimit = Number(limit);
        const skip = (currentPage - 1) * currentLimit;

        const where = {
            ...(address && {
                address: {
                    contains: address,
                    mode: "insensitive",
                },
            }),
            ...(city && {
                city: {
                    is: {
                        name: {
                            contains: city,
                            mode: "insensitive",
                        },
                    },
                },
            }),
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        city: {
                            is: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                    {
                        address: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        };

        const [shelters, total] = await Promise.all([
            prisma.shelter.findMany({
                where,
                include: {
                    city: true,
                    images: true,
                    _count: {
                        select: {
                            animals: true,
                        },
                    },
                },
                skip,
                take: currentLimit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.shelter.count({ where }),
        ]);

        const sheltersWithAnimalCount = shelters.map((shelter) => ({
            ...shelter,
            animalsCount: shelter._count.animals,
        }));

        res.json({
            data: sheltersWithAnimalCount,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                totalPages: Math.ceil(total / currentLimit),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getShelterById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const shelter = await prisma.shelter.findUnique({
            where: { id },
            include: {
                city: true,
                images: true,
                animals: {
                    include: {
                        images: true,
                        breed: true,
                    },
                },
                _count: {
                    select: {
                        animals: true,
                    },
                },
            },
        });

        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        res.json({
            ...shelter,
            animalsCount: shelter._count.animals,
        });
    } catch (error) {
        next(error);
    }
};

export const getShelterAnimals = async (req, res, next) => {
    try {
        const { shelterId } = req.params;

        const shelter = await prisma.shelter.findUnique({
            where: { id: shelterId },
            select: { id: true },
        });

        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        const animals = await prisma.animal.findMany({
            where: { shelterId },
            include: {
                images: true,
                breed: true,
                shelter: { include: { city: true } },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(animals);
    } catch (error) {
        next(error);
    }
};

export const createShelter = async (req, res, next) => {
    try {
        const {
            name,
            description,
            city,
            address,
            phone,
            email,
            foundationDate,
            workingHours,
        } = req.body;

        const shelter = await prisma.shelter.create({
            data: {
                name,
                description,
                city: {
                    connectOrCreate: {
                        where: { name: city },
                        create: { name: city },
                    },
                },
                address,
                phone,
                email,
                foundationDate: foundationDate ? new Date(foundationDate) : null,
                workingHours,
            },
            include: { city: true },
        });

        res.status(201).json(shelter);
    } catch (error) {
        next(error);
    }
};

export const updateShelter = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { foundationDate, city, ...rest } = req.body;

        const shelter = await prisma.shelter.update({
            where: { id },
            data: {
                ...rest,
                ...(foundationDate !== undefined && {
                    foundationDate: foundationDate ? new Date(foundationDate) : null,
                }),
                ...(city !== undefined && {
                    city: {
                        connectOrCreate: {
                            where: { name: city },
                            create: { name: city },
                        },
                    },
                }),
            },
            include: { city: true },
        });

        res.json(shelter);
    } catch (error) {
        next(error);
    }
};

export const deleteShelter = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.shelter.delete({
            where: { id },
        });

        res.json({ message: "Shelter deleted successfully" });
    } catch (error) {
        next(error);
    }
};
