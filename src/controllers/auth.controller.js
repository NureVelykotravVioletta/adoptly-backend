import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { transporter } from "../lib/mailer.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, avatarUrl } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                phone,
                avatarUrl,
            },
        });

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // щоб не палити, існує такий email чи ні
        if (!user) {
            return res.json({
                message: "If an account with this email exists, a reset link has been sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 хв

        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Password reset",
            html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 30 minutes.</p>
      `,
        });

        res.json({
            message: "If an account with this email exists, a reset link has been sent.",
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.json({ message: "Password has been reset successfully" });
    } catch (error) {
        next(error);
    }
};