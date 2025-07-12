import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import {errorHandler} from "./middleware/errorHandler.js";
// import sessionGuard from "./middleware/sessionGuard.js";
// import activityLogger from "./middleware/activityLogger.js";
// import vaultRoutes from "./routes/vaultRoutes";

dotenv.config({debug: false, override: true});

const app = express();
// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(express.json({
    strict: true,
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf); // throws if not valid
      } catch (e) {
        throw new SyntaxError('Invalid JSON');
      }
    }
  }));

// app routes
app.use("/api/auth", authRoutes);
// app.use("/api/vault", vaultRoutes);

// Error handler
app.use(errorHandler);

export default app;
