import express, { Router, type Request, type Response } from "express";
import config from "./config/config.js";

export const app = express();
const port = config.port;

// router creation
export const router = Router();

// middlewares call
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

// route call as middleware
app.use("/api", router);

// root top route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!\nDebPulse Server is running...");
});

// server listening
app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}.\n Open http://localhost:${port}/ to inspect your server`,
  );
});
