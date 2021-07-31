import { Request, Response } from "express";
import { Categoria } from "../models/cms.models";

export const crearCategoria = async (req: Request, res: Response) => {
   const { ...data } = req.body;

   try {
      const nuevaCategoria = await Categoria.create(data);
      return res.status(201).json({
         success: true,
         content: nuevaCategoria,
         message: "Categoria creada exitosamente",
      });
   } catch (error) {
      return res.status(400).json({
         success: true,
         content: null,
         message: `Error al crear la categoria, ${error.message}`,
      });
   }
};

export const listarCategorias = async (req: Request, res: Response) => {
   const categorias = await Categoria.findAll();
   return res.status(200).json({
      success: true,
      content: categorias,
      message: "lista de todas las categorias registradas",
   });
};
