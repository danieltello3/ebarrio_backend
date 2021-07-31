import { Router } from "express";
import { pedidoRequestDto } from "../controllers/dto.request";
import { crearPedido, listarPedidos } from "../controllers/pedidos";
import { authValidator } from "../utils/validador";

export const pedidoRouter = Router();

pedidoRouter
   .route("/pedidos")
   .post(authValidator, pedidoRequestDto, crearPedido)
   .get(authValidator, listarPedidos);
