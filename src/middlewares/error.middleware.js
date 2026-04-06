export const errorMiddleware = (error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    if (error.code === "P2025") {
        return res.status(404).json({ message: "Record not found" });
    }

    if (error.code === "P2002") {
        return res.status(400).json({ message: "Unique field already exists" });
    }

    res.status(500).json({
        message: error.message || "Internal server error",
    });
};