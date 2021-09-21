import { Request, Response } from "express";
import { Model } from "sequelize/types";
import {
   Imagen,
   Producto,
   Producto_Imagen,
   Usuario,
} from "../models/cms.models";
import {
   eliminarArchivoUtil,
   subirArchivoUtil,
} from "../utils/firebaseStorage";
import { RequestUser } from "../utils/validador";

interface IImagen {
   imagenId: number;
   imagenNombre: string;
   imagenExtension: string;
   imagenPath: string;
   updatedAt: string;
   createdAt: string;
}

type TImagen = {
   imagenId: number;
   imagenNombre: string;
   imagenExtension: string;
   imagenPath: string;
   updatedAt: string;
   createdAt: string;
};

export const subirImagen = async (req: RequestUser, res: Response) => {
   try {
      const { carpeta, productoId } = req.query;
      if (req.file) {
         const archivo: Express.Multer.File = req.file;
         const archivoArray = req.file.originalname.split(".");
         const extension = archivoArray[archivoArray?.length - 1];
         const archivo_sin_extension = req.file.originalname.replace(
            `.${extension}`,
            ""
         );
         const nombre_archivo = `${archivo_sin_extension}_${Date.now()}`;

         archivo.originalname = `${nombre_archivo}.${extension}`;
         const link = await subirArchivoUtil(archivo, String(carpeta));

         const nuevaImagen: Model<IImagen> = await Imagen.create({
            imagenNombre: nombre_archivo,
            imagenExtension: extension,
            imagenPath: carpeta,
         });

         const imagenData: TImagen = nuevaImagen.toJSON() as TImagen;
         const imagenId = imagenData.imagenId;

         await Usuario.update(
            { imagenId: imagenId },
            { where: { usuarioId: req.user?.getDataValue("usuarioId") } }
         );
         const content = { ...imagenData, link };
         return res.status(201).json({
            success: true,
            content,
            message: "Archivo subido exitosamente",
         });
      }
      const archivos = req.files as Express.Multer.File[] | undefined;
      if (archivos) {
         try {
            const imagenes = await Promise.all(
               archivos.map(async (archivo: Express.Multer.File) => {
                  const archivoArray = archivo.originalname.split(".");
                  const extension = archivoArray[archivoArray?.length - 1];
                  const archivo_sin_extension = archivo.originalname.replace(
                     `.${extension}`,
                     ""
                  );
                  const nombre_archivo = `${archivo_sin_extension}_${Date.now()}`;

                  archivo.originalname = `${nombre_archivo}.${extension}`;
                  const link = await subirArchivoUtil(archivo, String(carpeta));
                  const imagen = await Imagen.create({
                     imagenNombre: nombre_archivo,
                     imagenExtension: extension,
                     imagenPath: carpeta,
                  });
                  return { imagen, link };
               })
            );
            const producto_imagen: Model<IImagen>[] = await Promise.all(
               imagenes.map(async (objeto) => {
                  const dataImagen: TImagen = objeto.imagen.toJSON() as TImagen;
                  return await Producto_Imagen.create({
                     imageneImagenId: dataImagen.imagenId,
                     productoProductoId: productoId,
                  });
               })
            );

            const content = imagenes.map((objeto) => {
               const dataImagen: TImagen = objeto.imagen.toJSON() as TImagen;
               const link: string = objeto.link;

               return { ...dataImagen, link };
            });

            return res.status(201).json({
               success: true,
               content,
               message: "Archivos subidos exitosamente",
            });
         } catch (error) {
            console.log(error);
            return res.status(400).json(ErrorEvent);
         }
      }
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al subir la imagen, ${error}`,
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
         message: `Error al eliminar el archivo, ${error}`,
      });
   }
};
