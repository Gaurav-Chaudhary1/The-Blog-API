import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ message: 'No authorization header provided' });
        }

        const parts = header.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(400).json({ message: "Authorization format must be Bearer [token] " });
        }
        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};