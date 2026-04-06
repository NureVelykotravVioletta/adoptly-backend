import { prisma } from "../lib/prisma.js";

export const createReminder = async (req, res, next) => {
    try {
        const { title, description, reminderDate, animalId } = req.body;

        // якщо передали animalId — перевіряємо що тварина існує
        if (animalId) {
            const animal = await prisma.animal.findUnique({
                where: { id: animalId },
            });

            if (!animal) {
                return res.status(404).json({ message: "Animal not found" });
            }
        }

        const reminder = await prisma.careReminder.create({
            data: {
                title,
                description,
                reminderDate: new Date(reminderDate),
                userId: req.user.id,
                animalId,
            },
        });

        res.status(201).json(reminder);
    } catch (error) {
        next(error);
    }
};

export const getReminders = async (req, res, next) => {
    try {
        const reminders = await prisma.careReminder.findMany({
            where: { userId: req.user.id },
            include: {
                animal: true,
            },
            orderBy: {
                reminderDate: "asc",
            },
        });

        res.json(reminders);
    } catch (error) {
        next(error);
    }
};

export const updateReminder = async (req, res, next) => {
    try {
        const { id } = req.params;

        // перевірка що reminder належить юзеру
        const existing = await prisma.careReminder.findUnique({
            where: { id },
        });

        if (!existing) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        if (existing.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updated = await prisma.careReminder.update({
            where: { id },
            data: {
                ...req.body,
                ...(req.body.reminderDate && {
                    reminderDate: new Date(req.body.reminderDate),
                }),
            },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteReminder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.careReminder.findUnique({
            where: { id },
        });

        if (!existing) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        if (existing.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await prisma.careReminder.delete({
            where: { id },
        });

        res.json({ message: "Reminder deleted successfully" });
    } catch (error) {
        next(error);
    }
};