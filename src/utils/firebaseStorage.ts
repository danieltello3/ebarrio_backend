import { Storage } from "@google-cloud/storage";

import dotenv from "dotenv";
dotenv.config();

const storage = new Storage({
   projectId: "ebarrio-storage",
   credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
   },
});

const bucket = storage.bucket("ebarrio-storage.appspot.com");

export const subirArchivoUtil = (
   archivo: Express.Multer.File,
   path: string
): Promise<string> => {
   return new Promise((resolve, reject) => {
      if (!archivo) {
         reject("No se encontro el archivo");
      }

      const nuevo_archivo = bucket.file(`${path}/${archivo.originalname}`);

      const blobStream = nuevo_archivo.createWriteStream({
         metadata: {
            contentType: archivo.mimetype,
         },
      });

      blobStream.on("error", (error) => {
         reject(error.message);
      });

      blobStream.on("finish", async () => {
         try {
            const link = await nuevo_archivo.getSignedUrl({
               action: "read",
               expires: Date.now() + 3000 * 60 * 60,
            });
            resolve(link.toString());
         } catch (error) {
            reject(error);
         }
      });

      blobStream.end(archivo.buffer);
   });
};

export const generarUrl = async (carpeta: string, archivo: string) => {
   try {
      const url = await bucket.file(`${carpeta}/${archivo}`).getSignedUrl({
         action: "read",
         expires: Date.now() + 3000 * 60 * 60,
      });
      return url.toString();
   } catch (error) {
      console.log(error);
      return error;
   }
};

export const eliminarArchivoUtil = async (carpeta: string, archivo: string) => {
   try {
      const respuesta = await bucket
         .file(`${carpeta}/${archivo}`)
         .delete({ ignoreNotFound: true });
      console.log(respuesta);
      return respuesta;
   } catch (error) {
      console.log(error);
      return error;
   }
};
