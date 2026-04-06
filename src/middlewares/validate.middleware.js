export const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.issues?.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
    };
};