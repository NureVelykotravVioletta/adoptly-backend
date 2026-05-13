import { prisma } from "../lib/prisma.js";

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

        const article = await prisma.article.create({
            data: {
                title,
                content,
                imageUrl,
            },
        });

        res.status(201).json(article);
    } catch (error) {
        next(error);
    }
};

export const deleteArticle = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.article.delete({
            where: { id },
        });

        res.json({ message: "Article deleted" });
    } catch (error) {
        next(error);
    }
};
