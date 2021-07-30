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

         archivo.originalname = `${nombre_archivo}.${extension}`;
         const link = await subirArchivoUtil(archivo, String(carpeta));

         const nuevaImagen = await Imagen.create({
            imagenNombre: nombre_archivo,
            imagenExtension: extension,
            imagenPath: carpeta,
         });

         const imagenData = nuevaImagen.toJSON();
         console.log(imagenData);
         const content = { ...imagenData, link };
         return res.status(201).json({
            success: true,
            content,
            message: "Archivo subido exitosamente",
         });
      }
      const archivos = req.files;
      console.log(archivos);
      if (archivos) {
         const content: Array<Object> = [];
         // try {
         //    Promise.all(
         //       archivos.map((archivo: Express.Multer.File) => {
         //          const archivoArray = archivo.originalname.split(".");
         //          const extension = archivoArray[archivoArray?.length - 1];
         //          const archivo_sin_extension = archivo.originalname.replace(
         //             `.${extension}`,
         //             ""
         //          );
         //          const nombre_archivo = `${archivo_sin_extension}_${Date.now()}`;

         //          archivo.originalname = `${nombre_archivo}.${extension}`;
         //          console.log("ok");
         //          const link = subirArchivoUtil(archivo, String(carpeta));
         //          return link;
         //       })
         //    ).then((results) => {
         //       console.log(results);
         //    });
         //    // const nuevaImagen = Imagen.create({
         //    //    imagenNombre: nombre_archivo,
         //    //    imagenExtension: extension,
         //    //    imagenPath: carpeta,
         //    // });
         // } catch (error) {
         //    console.log(error);
         // }

         return res.status(201).json({
            success: true,
            content,
            message: "Archivos subidos exitosamente",
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
   const { id } = req.params;

   try {
      const imagen = await Imagen.findByPk(id);
      if (!imagen) {
         return res.status(400).json({
            success: false,
            content: null,
            message: "no hay una imagen con este id",
         });
      }
      const carpeta = imagen?.getDataValue("imagenPath");
      const archivo = `${imagen?.getDataValue(
         "imagenNombre"
      )}.${imagen?.getDataValue("imagenExtension")}`;
      await eliminarArchivoUtil(carpeta, archivo);
      await imagen.destroy();
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
