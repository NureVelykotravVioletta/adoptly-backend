import { prisma } from "../lib/prisma.js";

const applicationStatuses = ["PENDING", "APPROVED", "REJECTED"];

const getStatusFilter = (status) => {
    if (status === undefined) {
        return {};
    }

    if (!applicationStatuses.includes(status)) {
        return { error: { message: "Invalid status" } };
    }

    return { status };
};

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

        if (!animal.shelterId) {
            return res.status(400).json({ message: "This animal is not available in a shelter" });
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
        const statusFilter = getStatusFilter(req.query.status);

        if (statusFilter.error) {
            return res.status(400).json(statusFilter.error);
        }

        const applications = await prisma.adoptionApplication.findMany({
            where: {
                userId,
                ...statusFilter,
            },
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

export const getApplications = async (req, res, next) => {
    try {
        const statusFilter = getStatusFilter(req.query.status);

        if (statusFilter.error) {
            return res.status(400).json(statusFilter.error);
        }

        const applications = await prisma.adoptionApplication.findMany({
            where: statusFilter,
            include: {
                user: true,
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

        if (!applicationStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const application = await prisma.adoptionApplication.findUnique({
            where: { id },
            include: {
                animal: {
                    select: {
                        status: true,
                        adoptedById: true,
                    },
                },
            },
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (
            status === "APPROVED" &&
            application.animal.status === "ADOPTED" &&
            application.animal.adoptedById !== application.userId
        ) {
            return res.status(400).json({ message: "This animal is already adopted" });
        }

        const updatedApplication = await prisma.$transaction(async (tx) => {
            await tx.adoptionApplication.update({
                where: { id },
                data: { status },
            });

            if (status === "APPROVED") {
                await tx.animal.update({
                    where: { id: application.animalId },
                    data: {
                        status: "ADOPTED",
                        shelter: {
                            disconnect: true,
                        },
                        adoptedBy: {
                            connect: { id: application.userId },
                        },
                    },
                });

                await tx.adoptionApplication.updateMany({
                    where: {
                        animalId: application.animalId,
                        id: { not: id },
                        status: "PENDING",
                    },
                    data: { status: "REJECTED" },
                });
            }

            return tx.adoptionApplication.findUnique({
                where: { id },
                include: {
                    user: true,
                    animal: true,
                },
            });
        });

        res.json(updatedApplication);
    } catch (error) {
        next(error);
    }
};
