import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const connection = new Sequelize(String(process.env.DATABASE_URL), {
   dialect: "postgres",
   timezone: "-05:00",
   logging: false,
});
