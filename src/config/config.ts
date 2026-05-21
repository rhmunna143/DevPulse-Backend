import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const db_url = process.env.DATABASE_URL as string;

const config = {
  port,
  db_url
};

export default config;
