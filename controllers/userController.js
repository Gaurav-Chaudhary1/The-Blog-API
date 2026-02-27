import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Register a new user
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = await User.findOne({ email });

        // Check if user already exists
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered succesfully',
            user: {
                id: newUser._id,
                name: `${newUser.firstName} ${newUser.lastName}`,
                email: newUser.email
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error registering user',
            error: err.message
        });
    }
};

// Login user and generate JWT token
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                token: token
            }
        });
    } catch (err) { 
        res.status(500).json({
            message: 'Some error occured, Please try again later',
            error: err.message
        });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching user profile',
            error: err.message
        });
    }
};