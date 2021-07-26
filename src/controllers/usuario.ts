import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { BlackList, Usuario } from "../models/cms.models";
import dotenv from "dotenv";
import { RequestUser } from "../utils/validador";
dotenv.config();

//REGISTART USUARIO
export const registro = async (req: Request, res: Response) => {
   const user = req.body;
   try {
      const nuevoUsuario = await Usuario.create(user);

      const usuarioEncontrado = await Usuario.findOne({
         where: { usuarioId: nuevoUsuario.getDataValue("usuarioId") },
         attributes: {
            exclude: ["usuarioPassword"],
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
         content: error,
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
   return res.status(200).json({
      success: true,
   });
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
