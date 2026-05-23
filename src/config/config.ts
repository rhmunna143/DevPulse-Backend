import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const db_url = process.env.DATABASE_URL as string;
const jwt_secret = process.env.JWT_SECRET ?? "dev-secret-hiji-biji-bij";
const frontend_url = process.env.FRONTEND_URL ?? "http://localhost:3000";

const config = {
  port,
  db_url,
  jwt_secret,
  frontend_url,
};

export default config;
