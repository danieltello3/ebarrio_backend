import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { BlackList, Imagen, Usuario } from "../models/cms.models";
import dotenv from "dotenv";
import { RequestUser } from "../utils/validador";
import { generarUrl } from "../utils/firebaseStorage";
dotenv.config();

//REGISTART USUARIO
export const registro = async (req: Request, res: Response) => {
   const {
      usuarioNombre,
      usuarioApellido,
      usuarioCorreo,
      usuarioPassword,
      tipoId,
      usuarioTelefono,
   } = req.body;
   try {
      const nuevoUsuario = await Usuario.create({
         usuarioNombre,
         usuarioApellido,
         usuarioCorreo,
         usuarioPassword,
         tipoId,
         usuarioTelefono,
      });

      const usuarioEncontrado = await Usuario.findOne({
         where: { usuarioId: nuevoUsuario.getDataValue("usuarioId") },
         attributes: {
            exclude: ["usuarioPassword", "createdAt", "updatedAt"],
         },
      });
      return res.status(201).json({
         success: true,
         content: usuarioEncontrado?.toJSON(),
         message: "Usuario creado exitosamente",
      });
   } catch (error) {
      res.status(400).json({
         success: false,
         content: error.message,
         message: "Error al crear el usuario",
      });
   }
};

//LOGIN
export const login = async (req: Request, res: Response) => {
   const { email, password } = req.body;
   const usuario = await Usuario.findOne({ where: { usuarioCorreo: email } });
   if (usuario) {
      const checkPassword = compareSync(
         password,
         usuario.getDataValue("usuarioPassword")
      );
      if (checkPassword) {
         const payload = {
            usuarioId: usuario?.getDataValue("usuarioId"),
         };
         const token = sign(payload, String(process.env.JWT_SECRET), {
            expiresIn: "3h",
         });

         return res.status(200).json({
            success: true,
            content: token,
            message: "login correcto",
         });
      } else {
         return res.status(404).json({
            success: false,
            content: null,
            message: "contraseña incorrecta",
         });
      }
   }
   return res.status(404).json({
      success: false,
      content: null,
      message: "Credenciales incorrectas",
   });
};

//MOSTRAR USUARIO
export const perfil = async (
   req: RequestUser,
   res: Response
): Promise<Response> => {
   const imagenId = req?.user?.getDataValue("imagenId");
   const imagen_encontrada = await Imagen.findByPk(imagenId);
   let url = null;
   console.log(imagen_encontrada);
   try {
      if (imagen_encontrada) {
         url = await generarUrl(
            imagen_encontrada?.getDataValue("imagenPath"),
            `${imagen_encontrada?.getDataValue(
               "imagenNombre"
            )}.${imagen_encontrada?.getDataValue("imagenExtension")}`
         );
      }
      const content = { ...req?.user?.toJSON(), url };
      return res.status(200).json({
         success: true,
         content,
         message: `Datos de usuario ${req?.user?.usuarioId}`,
      });
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al actualizar el perfil, ${error.message}`,
      });
   }
};

//lOGOUT
export const logout = async (req: Request, res: Response) => {
   if (!req.headers.authorization) {
      return res.status(400).json({
         success: false,
         content: null,
         message: "Se necesita una token para hacer logout",
      });
   }
   const token = req.headers.authorization.split(" ")[1];
   try {
      await BlackList.create({ blackListToken: token });
      return res.status(204).end();
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al hacer el logout: ${error.message}`,
      });
   }
};

export const updatePerfil = async (req: RequestUser, res: Response) => {
   const id = req.user?.getDataValue("usuarioId");
   const { ...data } = req.body;
   console.log(id, data);
   try {
      await Usuario.update(data, {
         where: {
            usuarioId: id,
         },
      });
      return res.status(200).json({
         success: true,
         content: null,
         message: "usuario actualizado exitosamente",
      });
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: "Error al actualizar el usuario",
      });
   }
};
