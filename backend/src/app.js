import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes";
// import vaultRoutes from "./routes/vaultRoutes";
// import errorHandler from "./middleware/errorHandler";

dotenv.config({debug: false, override: true});

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// app routes
// app.use("/api/auth", authRoutes);
// app.use("/api/vault", vaultRoutes);

// Error handler
// app.use(errorHandler);

export default app;
