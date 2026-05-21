import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const db_url = process.env.DATABASE_URL as string;
const jwt_secret = process.env.JWT_SECRET ?? "dev-secret-hiji-biji-bij";

const config = {
  port,
  db_url,
  jwt_secret,
};

export default config;
