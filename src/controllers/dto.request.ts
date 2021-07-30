import { Request, Response, NextFunction } from "express";

type TTipoRequest = {
   tipoNombre: string;
};

type TCategoriaRequest = {
   categoriaNombre: string;
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

export type TProductoRequest = {
   productoNombre: string;
   productoPrecio: number;
   productoCodigo: string;
   productoDescripcion: string;
   productoCantidad: number;
   categoriaId: number;
   usuarioId?: number;
};

export type TDetalle = {
   detalleCantidad: number;
   detalleSubTotal: number;
   productoId: number;
};

export type TPedidoRequest = {
   pedidoFecha: string;
   pedidoNombreCliente: string;
   pedidoDocumentoCliente: string;
   pedidoDetalle: Array<TDetalle>;
};
//DTO TIPO
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

//DTO USUARIOS
export const registroRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TUsuarioRequest = req.body;
   if (
      data?.usuarioNombre &&
      data?.usuarioApellido &&
      data?.usuarioCorreo &&
      data?.usuarioPassword &&
      data?.tipoId
   ) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message:
            "el registro necesita al menos los siguientes datos: nombre, apellido, correo, password y tipo de usuario",
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

export const updateRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TUsuarioRequest = req.body;
   if (
      data?.usuarioNombre &&
      data?.usuarioApellido &&
      data?.usuarioCorreo &&
      data?.usuarioPassword &&
      data?.tipoId
   ) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message:
            "para actualizar el usuario, debes mandar todos los campos obligatorios",
      });
   }
};

//DTO ARCHIVOS
export const manejoArchivosDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const archivo = req.file;
   const archivos = req?.files;
   console.log(archivos);

   const { carpeta } = req.query;
   if (!carpeta) {
      return res.status(400).json({
         success: false,
         content: null,
         message: "falta la carpeta de destino",
      });
   }
   if (!archivo && !archivos) {
      return res.status(400).json({
         success: false,
         content: null,
         message: "falta el archivo",
      });
   }

   const size = req.file?.size;
   if (size) {
      if (size && size <= 5242880) {
         next();
      } else {
         return res.status(400).json({
            success: false,
            content: null,
            message: "el archivo no puede superar los 5MB",
         });
      }
   }
   const errores: Array<string> = [];

   // archivos?.map((archivo: Express.Multer.File) => {
   //    const size = archivo.size;
   //    if (size >= 5242880) {
   //       errores.push(`el archivo ${archivo.originalname} supera los 5MB`);
   //    }
   // });
   console.log(errores);
   if (errores.length === 0) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: errores,
      });
   }
};

//DTO PRODUCTOS
export const crearProductoRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TProductoRequest = req.body;
   if (
      data?.productoNombre &&
      data?.productoCodigo &&
      data?.productoPrecio &&
      data?.productoDescripcion &&
      data?.productoCantidad &&
      data?.categoriaId
   ) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message:
            "falta el nombre, precio, codigo, descripcion, cantidad, o categoriaId",
      });
   }
};

export const updateProductoRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { id } = req.params;
   const { ...data }: TProductoRequest = req.body;
   if (!id) {
      return res.status(400).json({
         success: false,
         content: null,
         message: "debe mandar un id como parametro",
      });
   }
   if (
      data?.productoNombre &&
      data?.productoCodigo &&
      data?.productoDescripcion &&
      data?.categoriaId &&
      data?.productoPrecio &&
      data?.productoCantidad
   ) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message:
            "para actualizar el producto, debes mandar todos los campos obligatoriamente",
      });
   }
};

//DTO CATEGORIAS
export const categoriaRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TCategoriaRequest = req.body;
   if (data?.categoriaNombre) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: "falta el nombre de la categoria",
      });
   }
};

//DTO PEDIDOS
export const pedidoRequestDto = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { ...data }: TPedidoRequest = req.body;

   if (
      data.pedidoDetalle &&
      data.pedidoDocumentoCliente &&
      data.pedidoFecha &&
      data.pedidoNombreCliente
   ) {
      next();
   } else {
      return res.status(400).json({
         success: false,
         content: null,
         message: "Faltan datos del pedido",
      });
   }
};
