import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { BlackList, Usuario } from "../models/cms.models";
dotenv.config();
export interface RequestUser extends Request {
   user?: any;
}

const verificarToken = (token: string): JwtPayload | string => {
   try {
      const payload = verify(token, String(process.env.JWT_SECRET));
      return payload;
   } catch (error) {
      return error;
   }
};

export const authValidator = async (
   req: RequestUser,
   res: Response,
   next: NextFunction
) => {
   if (!req.headers.authorization) {
      return res.status(401).json({
         success: false,
         content: null,
         message: "se necesita una token para este request",
      });
   }
   const token = req.headers.authorization.split(" ")[1];

   const tokenBlackList = await BlackList.findByPk(token);

   if (tokenBlackList) {
      return res.status(401).json({
         success: false,
         content: null,
         message: "esta token ya no es valida",
      });
   }

   const resultado = verificarToken(token);

   if (typeof resultado === "object") {
      const id = resultado.usuarioId;
      const usuario = await Usuario.findByPk(id, {
         attributes: { exclude: ["usuarioPassword"] },
      });
      req.user = usuario;
      next();
   } else {
      return res.status(401).json({
         success: false,
         content: null,
         message: "Token invalida",
      });
   }
};
