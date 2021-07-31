import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { BlackList, Imagen, Tipo, Usuario } from "../models/cms.models";
import { Op } from "sequelize";
dotenv.config();
export interface RequestUser extends Request {
   user?: any;
}

const verificarToken = (token: string): JwtPayload | string => {
   try {
      const payload = verify(token, String(process.env.JWT_SECRET));
      return payload;
   } catch (error) {
      return error.message;
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
         attributes: { exclude: ["usuarioPassword", "updatedAt", "createdAt"] },
         include: {
            model: Imagen,
            attributes: { exclude: ["updatedAt", "createdAt"] },
         },
      });
      req.user = usuario;
      next();
   } else {
      return res.status(401).json({
         success: false,
         content: null,
         message: `Token invalida, ${resultado}`,
      });
   }
};

export const isVendedor = async (
   req: RequestUser,
   res: Response,
   next: NextFunction
) => {
   const vendedor = await Tipo.findOne({
      where: {
         tipoNombre: { [Op.iLike]: "vendedor" },
         tipoId: req.user?.getDataValue("tipoId"),
      },
   });

   if (vendedor) {
      next();
   } else {
      return res.status(401).json({
         success: true,
         content: null,
         message: "el usuario no es vendedor",
      });
   }
};
