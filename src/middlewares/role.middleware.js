export const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Role check failed" });
        }
    };
};