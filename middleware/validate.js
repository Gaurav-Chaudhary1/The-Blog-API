import { z } from 'zod';

// Validation middleware
export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation Failed',
                errors: error.errors.map(e => ({ field: e.path[0], message: e.message } ))
            });
        }
        console.error("Unexpected Middleware Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};