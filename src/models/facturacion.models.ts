import { DataTypes } from "sequelize";
import { connection } from "../config/sequelize";

const comprobanteModel = connection.define(
   "comprobante",
   {
      comprobanteId: {
         type: DataTypes.INTEGER,
         field: "id",
         primaryKey: true,
         autoIncrement: true,
         unique: true,
      },
      comprobanteSerie: {
         type: DataTypes.STRING,
         field: "serie",
         allowNull: false,
      },
      comprobanteNumero: {
         type: DataTypes.INTEGER,
         field: "numero",
         allowNull: false,
      },
      comprobantePdf: {
         type: DataTypes.TEXT,
         field: "pdf",
      },
      comprobanteCdr: {
         type: DataTypes.TEXT,
         field: "cdr",
      },
      comprobanteXml: {
         type: DataTypes.TEXT,
         field: "xml",
      },
      comprobanteDocumentoCliente: {
         type: DataTypes.STRING,
         field: "documento_cliente",
         allowNull: true,
      },
   },
   {
      modelName: "comprobantes",
   }
);
