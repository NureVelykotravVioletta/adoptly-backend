import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getArticles = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { search } = req.query;

        const skip = (page - 1) * limit;

        const where = {
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { content: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.article.count({ where }),
        ]);

        res.json({
            data: articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getArticleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const article = await prisma.article.findUnique({
            where: { id },
        });

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(article);
    } catch (error) {
        next(error);
    }
};

export const createArticle = async (req, res, next) => {
    try {
        const { title, content, imageUrl } = req.body;
        let articleImage = {
            imageUrl,
            imagePublicId: null,
        };

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);

            articleImage = {
                imageUrl: result.secure_url,
                imagePublicId: result.public_id,
            };
        }

        const article = await prisma.article.create({
            data: {
                title,
                content,
                ...articleImage,
            },
        });

        res.status(201).json(article);
    } catch (error) {
        next(error);
    }
};

export const updateArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl } = req.body;

        const existingArticle = await prisma.article.findUnique({
            where: { id },
        });

        if (!existingArticle) {
            return res.status(404).json({ message: "Article not found" });
        }

        const data = {
            title,
            content,
        };

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);

            data.imageUrl = result.secure_url;
            data.imagePublicId = result.public_id;

            if (existingArticle.imagePublicId) {
                await cloudinary.uploader.destroy(existingArticle.imagePublicId);
            }
        } else if (imageUrl !== undefined) {
            data.imageUrl = imageUrl;
            data.imagePublicId = null;

            if (existingArticle.imagePublicId) {
                await cloudinary.uploader.destroy(existingArticle.imagePublicId);
            }
        }

        const article = await prisma.article.update({
            where: { id },
            data,
        });

        res.json(article);
    } catch (error) {
        next(error);
    }
};

export const deleteArticle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const article = await prisma.article.findUnique({
            where: { id },
        });

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        if (article.imagePublicId) {
            await cloudinary.uploader.destroy(article.imagePublicId);
        }

        await prisma.article.delete({
            where: { id },
        });

        res.json({ message: "Article deleted" });
    } catch (error) {
        next(error);
    }
};
