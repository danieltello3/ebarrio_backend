import { Request, Response } from "express";
import { Op } from "sequelize";
import { Categoria, Imagen, Producto } from "../models/cms.models";
import {
   paginatedHelper,
   paginationSerializer,
} from "../utils/pagination.helper";
import { RequestUser } from "../utils/validador";

export const crearProducto = async (req: RequestUser, res: Response) => {
   const {
      productoNombre,
      productoPrecio,
      productoCodigo,
      productoDescripcion,
      productoCantidad,
      categoriaId,
   } = req.body;
   const usuarioId = req?.user.getDataValue("usuarioId");

   try {
      const nuevoProducto = await Producto.create({
         productoNombre,
         productoPrecio,
         productoCantidad,
         productoCodigo,
         productoDescripcion,
         categoriaId,
         usuarioId,
      });

      return res.status(201).json({
         success: true,
         content: nuevoProducto,
         message: "Producto creado exitosamente",
      });
   } catch (error) {
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al crear el producto, ${error.message}`,
      });
   }
};

export const listarProductos = async (req: Request, res: Response) => {
   const page = Number(req.query?.page) ?? 1;
   const perPage = Number(req.query?.perPage) ?? 10;

   const paginationParams = paginatedHelper({ page, perPage });

   const [total, productos] = await Promise.all([
      Producto.count(),
      Producto.findAll({
         attributes: { exclude: ["createdAt", "updatedAt"] },
         include: [Imagen],
         ...paginationParams,
      }),
   ]);

   const pagination = paginationSerializer(total, { perPage, page });

   return res.status(200).json({
      success: true,
      content: { pagination, productos },
      message: null,
   });
};

export const busquedaProductos = async (req: Request, res: Response) => {
   const {
      id,
      nombre,
      codigo,
      categoria,
      precioInicial,
      precioFinal,
      usuario,
   } = req.query;
   let filtro: Array<any> = [];
   if (nombre) {
      filtro = [
         ...filtro,
         { productoNombre: { [Op.iLike]: "%" + nombre + "%" } },
      ];
   }
   if (id) {
      filtro = [...filtro, { productoId: +id }];
   }
   if (codigo) {
      filtro = [...filtro, { productoCodigo: { [Op.iLike]: `%${codigo}%` } }];
   }
   if (categoria) {
      filtro = [...filtro, { categoriaId: +categoria }];
   }
   if (usuario) {
      filtro = [...filtro, { usuarioId: +usuario }];
   }
   if (precioInicial && precioFinal) {
      filtro = [
         ...filtro,
         {
            productoPrecio: {
               [Op.gte]: +precioInicial,
               [Op.lte]: +precioFinal,
            },
         },
      ];
   }

   const page = Number(req.query?.page) ?? 1;
   const perPage = Number(req.query?.perPage) ?? 10;
   const paginationParams = paginatedHelper({ page, perPage });

   const { count, rows } = await Producto.findAndCountAll({
      where: {
         [Op.and]: filtro,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      ...paginationParams,
   });

   const pagination = paginationSerializer(count, { perPage, page });

   return res.status(200).json({
      success: true,
      content: { pagination, content: rows },
      message: "productos filtrados",
   });
};

export const devolverProducto = async (req: Request, res: Response) => {
   const { id } = req.params;

   const producto = await Producto.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [Categoria, Imagen],
   });

   if (producto) {
      return res.status(200).json({
         success: true,
         content: producto,
         message: `se retorno el producto con el id: ${id}`,
      });
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: `no se encontro el producto con el id: ${id}`,
      });
   }
};

export const actualizarProducto = async (req: RequestUser, res: Response) => {
   const { id } = req.params;
   const userId = req.user?.getDataValue("usuarioId");

   if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
         success: false,
         content: null,
         message: "no esta mandando ningun campo a actualizar",
      });
   }
   const tareaActualizada = await Producto.update(req.body, {
      where: { [Op.and]: [{ productoId: id }, { usuarioId: userId }] },
   });

   if (tareaActualizada[0] === 1) {
      const data = await Producto.findByPk(id, {
         attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return res.status(200).json({
         success: true,
         content: data,
         message: "se actualizo el producto con exito",
      });
   } else {
      return res.status(404).json({
         success: false,
         content: null,
         message: `no se encontro el producto con el id ${id}`,
      });
   }
};

export const eliminarProducto = async (req: RequestUser, res: Response) => {
   const { id } = req.params;
   const userId = req.user?.getDataValue("usuarioId");
   try {
      const resultado: number = await Producto.destroy({
         where: { [Op.and]: [{ productoId: id }, { usuarioId: userId }] },
      });
      if (resultado === 1) {
         return res.status(200).json({
            success: true,
            content: null,
            message: `se elimino el producto con el id: ${id}`,
         });
      }
   } catch (error) {
      return res.status(404).json({
         success: false,
         content: null,
         message: `no se encontro ningun producto con el id: ${id}`,
      });
   }
};
