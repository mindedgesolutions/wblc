import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Middlewares
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

// Routes ---
import authRoute from "./routes/authRoutes.js";
import rolesPermissions from "./routes/rolesPermissions.js";
import userRoute from "./routes/userRoutes.js";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

// API starts ---
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/roles-permissions", rolesPermissions);
app.use("/api/v1/users", userRoute);
// API ends ---

const port = process.env.APP_PORT || 3001;

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: `not found` });
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
