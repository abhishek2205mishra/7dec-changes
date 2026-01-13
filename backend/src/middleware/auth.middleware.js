import httpStatus from "http-status";
import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        const token = req.query.token || req.body.token;
        
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "No token provided" });
        }

        const user = await User.findOne({ token });
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        if (!user.isAdmin) {
            return res.status(httpStatus.FORBIDDEN).json({ message: "Access denied. Admin only." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error: ${error.message}` });
    }
};

export { isAdmin };
