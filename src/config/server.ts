import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import { connection } from "./sequelize";
import morgan from "morgan";
import { tipoRouter } from "../routes/tipos";

dotenv.config();

export default class Server {
   app;
   port: string;
   constructor() {
      this.app = express();
      this.port = process.env.PORT || "8000";
      this.bodyParser();
      this.CORS();
      this.routes();
   }

   bodyParser() {
      this.app.use(json());
      this.app.use(morgan("dev"));
   }

   CORS() {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
         res.header("Access-Control-Allow-Origin", "*");
         res.header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
         );
         res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE"
         );
         next();
      });
   }

   routes() {
      this.app.get("/", (req: Request, res: Response) => {
         res.send("Bienviendo a la API de Ebarrio");
      });
      this.app.use(tipoRouter);
   }

   start() {
      this.app.listen(this.port, async () => {
         console.log(
            `Servidor corriendo exitosamente en el puerto ${this.port}`
         );
         try {
            await connection.sync();
            console.log("Base de datos sincronizada");
         } catch (error) {
            console.log(error);
         }
      });
   }
}
