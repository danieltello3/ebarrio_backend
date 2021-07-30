import { Router } from "express";
import {
   loginRequestDto,
   registroRequestDto,
   updateRequestDto,
} from "../controllers/dto.request";
import {
   updatePerfil,
   login,
   logout,
   perfil,
   registro,
} from "../controllers/usuario";
import { authValidator } from "../utils/validador";

export const usuarioRouter = Router();

usuarioRouter.post("/registro", registroRequestDto, registro);
usuarioRouter.post("/login", loginRequestDto, login);
usuarioRouter.post("/logout", logout);
usuarioRouter
   .route("/perfil")
   .get(authValidator, perfil)
   .put(authValidator, updateRequestDto, updatePerfil);

usuarioRouter.patch("/perfil/:id", updatePerfil);
