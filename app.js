import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkAuth from "./middlewares/authMiddleware.js";
import { spawn } from "child_process";
import { connectDB } from "./config/db.js";

await connectDB();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://storageapp.adipi.in",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/subscriptions", checkAuth, subscriptionRoutes);
app.use("/webhook", webhookRoutes);
app.use("/", userRoutes);
app.use("/auth", authRoutes);
app.post("/github-webhook", (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  const childprocess = spawn("bash", ["/home/ubuntu/deploy-frontend.mjs"]);
  
  childprocess.stdout.on("data", (data) => {
    process.stdout.write(data);
  });
  childprocess.stderr.on("data", (err) => {
    process.stderr.write(err);
  });
  childprocess.on("close", (code) => {
    res.json({ message: "ok" });
    if (code === 0) {
      console.log("scripted executed succesfully!");
    } else {
      console.log("script failed");
    }
  });

  childprocess.on("error", (err) => {
    res.json({ message: "ok" });
    console.log("error in spwaning the process!");
    console.log(err);
  });
});

app.post("/github-webhook-backend", (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  const childprocess = spawn("bash", ["/home/ubuntu/deploy-backend.mjs"]);

  childprocess.stdout.on("data", (data) => {
    process.stdout.write(data);
  });
  childprocess.stderr.on("data", (err) => {
    process.stderr.write(err);
  });
  childprocess.on("close", (code) => {
    res.json({ message: "ok" });
    if (code === 0) {
      console.log("backend script executed succesfully!");
    } else {
      console.log("script failed");
    }
  });

  childprocess.on("error", (err) => {
    res.json({ message: "ok" });
    console.log("error in spwaning the process!");
    console.log(err);
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: "Something went wrong!" });
  //res.json(err);
});

app.listen(PORT, () => {
  console.log(`Server Started`);
});

// https://stackoverflow.com/questions/18367824/how-to-cancel-http-upload-from-data-events
