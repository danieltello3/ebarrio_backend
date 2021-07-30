import { Router } from "express";
import { crearCategoria, listarCategorias } from "../controllers/categoria";
import { categoriaRequestDto } from "../controllers/dto.request";

export const categoriaRouter = Router();

categoriaRouter
   .route("/categorias")
   .get(listarCategorias)
   .post(categoriaRequestDto, crearCategoria);
