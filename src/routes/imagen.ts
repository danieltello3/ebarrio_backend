import { Router } from "express";
import Multer from "multer";
import { manejoArchivosDto } from "../controllers/dto.request";
import { eliminarArchivo, subirImagen } from "../controllers/imagen";
import { authValidator } from "../utils/validador";

const multer = Multer({
   storage: Multer.memoryStorage(),
});

export const imagenRouter = Router();

imagenRouter.post(
   "/subirImagen",
   multer.single("imagen"),
   manejoArchivosDto,
   subirImagen
);
imagenRouter.post(
   "/subirImagenProductos",
   multer.array("imagen", 5),
   manejoArchivosDto,
   subirImagen
);
imagenRouter.delete("/eliminarImagen/:id", eliminarArchivo);
