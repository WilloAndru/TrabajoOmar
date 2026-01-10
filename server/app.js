import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/api", routes);

export default app;
