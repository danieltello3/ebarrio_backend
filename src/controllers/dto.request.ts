import { Request, Response, NextFunction } from "express";

type TTipoRequest = {
   tipoNombre: string;
};

type TLoginRequest = {
   email: string;
   password: string;
};

type TUsuarioRequest = {
   usuarioNombre: string;
   usuarioApellido: string;
   usuarioTelefono?: string;
   usuarioCorreo: string;
   usuarioPassword: string;
   tipoId: number;
   imagenId?: number;
};

export const tipoRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TTipoRequest = req.body;
   if (data?.tipoNombre) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: "falta el nombre del tipo",
      });
   }
};

export const loginRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TLoginRequest = req.body;
   if (data?.email && data?.password) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: "falta el email o la password",
      });
   }
};
