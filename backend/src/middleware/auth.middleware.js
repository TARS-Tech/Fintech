const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log("error", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

exports.requireAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Admin access required",
        });
    }
    next();
}