import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// DB Connection
require("../db-config/db-connection");

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Use this middleware to parse incoming requests with URL-encoded payloads (e.g., form submissions)
app.use(express.json()); // Use this middleware to parse incoming requests with JSON payloads.


// Error handling middleware 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
