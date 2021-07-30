import { Request, Response } from "express";
import { Tipo } from "../models/cms.models";

export const crearTipo = async (
   req: Request,
   res: Response
): Promise<Response> => {
   try {
      const nuevoTipo = await Tipo.create(req.body);
      return res.status(201).json({
         success: true,
         message: "tipo creado exitosamente",
         content: nuevoTipo,
      });
   } catch (error) {
      console.log(error);
      return res.status(400).json({
         success: false,
         message: "error al crear el tipo",
         content: error,
      });
   }
};

export const listarTipos = async (req: Request, res: Response) => {
   const tipos = await Tipo.findAll();
   return res.status(200).json({
      success: true,
      content: tipos,
      message: "lista de tipos existentes",
   });
};
