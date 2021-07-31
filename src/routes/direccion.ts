import { Router } from "express";
import {
   crearDireccion,
   listarDirecciones,
   retornarDireccionUsuario,
} from "../controllers/direccion";
import { direccionRequestDto } from "../controllers/dto.request";
import { authValidator } from "../utils/validador";

export const direccionRouter = Router();

direccionRouter
   .route("/direcciones")
   .post(authValidator, direccionRequestDto, crearDireccion)
   .get(listarDirecciones);

direccionRouter.get(
   "/direccionUsuario",
   authValidator,
   retornarDireccionUsuario
);
