import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Load Environment Variables
dotenv.config();

// Import Local Modules
import regionRoutes from "./routes/regionRoutes.js";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// App Initialization
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL, // Change this to the actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Clerk Middleware for Authentication
app.use(clerkMiddleware()); // Use the clerkMiddleware from @clerk/express

// User Routes
app.use("/api/v1/region", regionRoutes);

// Handle Undefined Routes and Errors
app.use(notFound);
app.use(errorHandler);

// Database Connection
const connectDatabase = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Start the Application (No need for app.listen in Vercel)
const startApp = async () => {
  try {
    await connectDatabase();
    console.log('App is initialized and ready.');
  } catch (error) {
    console.error(`Error initializing app: ${error.message}`);
    process.exit(1);
  }
};

// Start the App
startApp();

// Export the app for Vercel deployment
export default  app;
