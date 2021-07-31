import { Router } from "express";
import {
   crearProductoRequestDto,
   updateProductoRequestDto,
} from "../controllers/dto.request";
import {
   actualizarProducto,
   busquedaProductos,
   crearProducto,
   devolverProducto,
   eliminarProducto,
   listarProductos,
} from "../controllers/producto";
import { authValidator, isVendedor } from "../utils/validador";

export const productoRouter = Router();

productoRouter
   .route("/productos")
   .post(authValidator, isVendedor, crearProductoRequestDto, crearProducto)
   .get(listarProductos);

productoRouter.get("/busquedaProductos", busquedaProductos);

productoRouter
   .route("/productos/:id")
   .get(devolverProducto)
   .put(authValidator, isVendedor, updateProductoRequestDto, actualizarProducto)
   .patch(authValidator, isVendedor, actualizarProducto)
   .delete(authValidator, isVendedor, eliminarProducto);
