import { Request, Response } from "express";
import { Imagen } from "../models/cms.models";
import {
   eliminarArchivoUtil,
   subirArchivoUtil,
} from "../utils/firebaseStorage";

export const subirImagen = async (req: Request, res: Response) => {
   try {
      const { carpeta } = req.query;

      if (req.file) {
         const archivo = req.file;
         const archivoArray = req.file.originalname.split(".");
         const extension = archivoArray[archivoArray?.length - 1];
         const archivo_sin_extension = req.file.originalname.replace(
            `.${extension}`,
            ""
         );
         const nombre_archivo = `${archivo_sin_extension}_${Date.now()}`;

         archivo.originalname = `${nombre_archivo}/${extension}`;

         const link = await subirArchivoUtil(archivo, String(carpeta));

         const nuevaImagen = await Imagen.create({
            imagenNombre: nombre_archivo,
            imagenExtension: extension,
            imagenPath: carpeta,
         });
         const content = { ...nuevaImagen.toJSON, link };
         return res.status(201).json({
            success: true,
            content,
            message: "Archivo subido exitosamente",
         });
      }
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al subir la imagen, ${error.message}`,
      });
   }
};

export const eliminarArchivo = async (req: Request, res: Response) => {
   const { carpeta, archivo } = req.body;
   try {
      await eliminarArchivoUtil(carpeta, archivo);
      return res.status(200).json({
         success: true,
         content: null,
         message: "archivo eliminado exitosamente",
      });
   } catch (error) {
      return res.status(404).json({
         success: false,
         content: null,
         message: `Error al eliminar el archivo, ${error.message}`,
      });
   }
};
