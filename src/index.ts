import express, { type Request, type Response } from "express";
import config from "./config/config.js";
import { initDB } from "./db/db.js";
import { globalErrorHandler } from "./utility/utility.js";
import { usersRouter } from "./modules/users/users.routes.js";

export const app = express();
const port = config.port;

// middlewares call
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
app.use("/api", usersRouter);
app.use(globalErrorHandler);

// root top route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!\nDebPulse Server is running...");
});

// server listening
app.listen(port, () => {
  initDB();
  
  console.log(
    `Example app listening on port ${port}.\n Open http://localhost:${port}/ to inspect your server`,
  );
});
