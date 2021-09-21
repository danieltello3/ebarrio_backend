import { Request, Response } from "express";
import { connection } from "../config/sequelize";
import { Detalle, Pedido } from "../models/cms.models";
import {
   paginatedHelper,
   paginationSerializer,
} from "../utils/pagination.helper";
import { RequestUser } from "../utils/validador";
import { TDetalle, TPedidoRequest } from "./dto.request";

export const crearPedido = async (req: RequestUser, res: Response) => {
   const transaccion = await connection.transaction();
   try {
      const {
         pedidoFecha,
         pedidoNombreCliente,
         pedidoDocumentoCliente,
         pedidoDetalle,
      }: TPedidoRequest = req.body;
      const nuevoPedido = await Pedido.create(
         {
            pedidoFecha,
            pedidoNombreCliente,
            pedidoDocumentoCliente,
            pedidoTotal: 0.0,
            usuarioId: req.user?.getDataValue("usuarioId"),
         },
         { transaction: transaccion }
      );

      let total = 0.0;

      const nuevoDetalle = await Promise.all(
         pedidoDetalle.map(
            async ({
               detalleCantidad,
               detalleSubTotal,
               productoId,
            }: TDetalle) => {
               total += detalleCantidad * detalleSubTotal;
               return await Detalle.create(
                  {
                     detalleCantidad,
                     detalleSubTotal,
                     productoId,
                     pedidoId: nuevoPedido.getDataValue("pedidoId"),
                  },
                  { transaction: transaccion }
               );
            }
         )
      );
      nuevoPedido.setDataValue("pedidoTotal", total);

      await nuevoPedido.save({ transaction: transaccion });
      await transaccion.commit();
      return res.status(201).json({
         success: true,
         content: { nuevoPedido, detallePedido: nuevoDetalle },
         message: "pedido creado exitosamente",
      });
   } catch (error) {
      console.log(error);
      await transaccion.rollback();
      return res.status(400).json({
         success: false,
         content: null,
         message: `Error al crear el pedido. ${error}`,
      });
   }
};

export const listarPedidos = async (req: RequestUser, res: Response) => {
   const page = Number(req.query?.page) ?? 1;
   const perPage = Number(req.query?.perPage) ?? 10;

   const paginationParams = paginatedHelper({ page, perPage });

   const { count, rows } = await Pedido.findAndCountAll({
      ...paginationParams,
      include: Detalle,
   });

   const pagination = paginationSerializer(count, { perPage, page });

   return res.status(200).json({
      success: true,
      content: { paginacion: pagination, content: rows },
      message: null,
   });
};
