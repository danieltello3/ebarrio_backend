import { Request, Response } from "express";
import { Direccion } from "../models/cms.models";
import { RequestUser } from "../utils/validador";
import { TDireccionRequest } from "./dto.request";

export const crearDireccion = async (req: RequestUser, res: Response) => {
   const {
      direccionNombre,
      direccionDistrito,
      direccionProvincia,
      direccionNumero,
      direccionDetalle,
   }: TDireccionRequest = req.body;
   try {
      const nuevaDireccion = await Direccion.create({
         direccionNombre,
         direccionDetalle,
         direccionDistrito,
         direccionNumero,
         direccionProvincia,
         usuarioId: req.user?.getDataValue("usuarioId"),
      });

      return res.status(201).json({
         success: true,
         content: nuevaDireccion,
         message: "Direccion creada exitosamente",
      });
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al crear la direccion, ${error.message}`,
      });
   }
};

export const listarDirecciones = async (req: Request, res: Response) => {
   const direcciones = await Direccion.findAll();
   return res.status(200).json({
      success: true,
      content: direcciones,
      message: "lista de todas las direcciones en la bd",
   });
};

export const retornarDireccionUsuario = async (
   req: RequestUser,
   res: Response
) => {
   const id = req.user?.getDataValue("usuarioId");
   console.log(id);
   const direcciones = await Direccion.findOne({
      where: {
         usuarioId: id,
      },
   });
   if (direcciones) {
      return res.status(200).json({
         success: true,
         content: direcciones,
         message: `direcciones del usuario con el id ${id}`,
      });
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: "no se encontro direcciones para este usuario",
      });
   }
};
