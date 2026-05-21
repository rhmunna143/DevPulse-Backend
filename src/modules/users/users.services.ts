import { sql } from "../../db/db.js";
import type { IUser, IUserWithPassword, UserRole } from "./users.interfaces.js";

export class AuthServices {
  static async createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole = "contributor",
  ): Promise<IUser> {
    const result = (await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${role})
      RETURNING id, name, email, role, created_at, updated_at
    `) as IUser[];

    return result[0] as IUser;
  }

  static async findUserByEmail(
    email: string,
  ): Promise<IUserWithPassword | null> {
    const rows = (await sql`
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users
      WHERE email = ${email}
    `) as IUserWithPassword[];
    
    return rows[0] ?? null;
  }
}
