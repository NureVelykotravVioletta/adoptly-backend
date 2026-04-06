import { prisma } from "../lib/prisma.js";

export const createApplication = async (req, res, next) => {
    try {
        const { animalId, message } = req.body;
        const userId = req.user.id;

        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }

        if (animal.status === "ADOPTED") {
            return res.status(400).json({ message: "This animal is already adopted" });
        }

        const existingApplication = await prisma.adoptionApplication.findFirst({
            where: {
                userId,
                animalId,
            },
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this animal" });
        }

        const application = await prisma.adoptionApplication.create({
            data: {
                userId,
                animalId,
                message,
            },
            include: {
                user: true,
                animal: {
                    include: {
                        shelter: true,
                        images: true,
                    },
                },
            },
        });

        res.status(201).json(application);
    } catch (error) {
        next(error);
    }
};

export const getMyApplications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const applications = await prisma.adoptionApplication.findMany({
            where: { userId },
            include: {
                animal: {
                    include: {
                        images: true,
                        shelter: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const application = await prisma.adoptionApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const updatedApplication = await prisma.adoptionApplication.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                animal: true,
            },
        });

        if (status === "APPROVED") {
            await prisma.animal.update({
                where: { id: application.animalId },
                data: { status: "ADOPTED" },
            });
        }

        res.json(updatedApplication);
    } catch (error) {
        next(error);
    }
};