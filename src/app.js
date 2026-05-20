import express from "express";
import cors from "cors";
import animalRoutes from "./routes/animal.routes.js";
import shelterRoutes from "./routes/shelter.routes.js";
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import userRoutes from "./routes/user.routes.js";
import animalImageRoutes from "./routes/animal-image.routes.js";
import shelterImageRoutes from "./routes/shelter-image.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import reminderRoutes from "./routes/reminder.routes.js";
import articleRoutes from "./routes/article.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.use("/animals", animalRoutes);
app.use("/shelters", shelterRoutes);
app.use("/shelter", shelterRoutes);
app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
app.use("/users", userRoutes);
app.use("/animals", animalImageRoutes);
app.use("/shelters", shelterImageRoutes);
app.use("/shelter", shelterImageRoutes);
app.use("/reminders", reminderRoutes);
app.use("/articles", articleRoutes);
app.use(errorMiddleware);

export default app;
