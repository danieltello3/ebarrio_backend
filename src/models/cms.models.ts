import { DataTypes } from "sequelize";
import { connection } from "../config/sequelize";
import { hashSync } from "bcrypt";

const usuarioModel = () =>
   connection.define(
      "usuario",
      {
         usuarioId: {
            type: DataTypes.INTEGER,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            unique: true,
         },
         usuarioNombre: {
            type: DataTypes.STRING,
            field: "nombre",
            allowNull: false,
            validate: {
               is: /([a-zA-Z])\w+([ ])/,
            },
         },
         usuarioApellido: {
            type: DataTypes.STRING,
            field: "apellido",
            allowNull: false,
            validate: {
               is: /([a-zA-Z])\w+([ ])/,
            },
         },
         usuarioTelefono: {
            type: DataTypes.STRING,
            field: "telefono",
            validate: {
               is: /([0-9]{9})/,
            },
         },
         usuarioCorreo: {
            type: DataTypes.STRING,
            field: "correo",
            allowNull: false,
            validate: {
               isEmail: true,
            },
            unique: true,
         },
         usuarioPassword: {
            type: DataTypes.TEXT,
            field: "password",
            allowNull: false,
            set: (valor: string) => hashSync(valor, 10),
         },
      },
      {
         modelName: "usuarios",
      }
   );

const tipoModel = connection.define(
   "tipo",
   {
      tipoId: {
         type: DataTypes.INTEGER,
         field: "id",
         primaryKey: true,
         autoIncrement: true,
         unique: true,
      },
      tipoNombre: {
         type: DataTypes.STRING,
         field: "nombre",
         unique: true,
         allowNull: false,
      },
   },
   {
      tableName: "tipos",
      timestamps: false,
   }
);

const direccionModel = connection.define(
   "direccion",
   {
      direccionId: {
         type: DataTypes.INTEGER,
         field: "id",
         primaryKey: true,
         autoIncrement: true,
         unique: true,
      },
      direccionNombre: {
         type: DataTypes.TEXT,
         field: "nombre",
         allowNull: false,
      },
      direccionDistrito: {
         type: DataTypes.STRING,
         field: "distrito",
         allowNull: false,
      },
      direccionProvincia: {
         type: DataTypes.STRING,
         field: "provincia",
         allowNull: false,
      },
      direccionNumero: {
         type: DataTypes.INTEGER,
         field: "numero",
         allowNull: false,
      },
      direccionDetalle: {
         type: DataTypes.STRING,
         field: "detalle",
      },
   },
   {
      modelName: "direcciones",
   }
);

const pedidoModel = connection.define(
   "pedido",
   {
      pedidoId: {
         type: DataTypes.INTEGER,
         field: "id",
         primaryKey: true,
         autoIncrement: true,
         unique: true,
      },
      pedidoFecha: {
         type: DataTypes.DATE,
         field: "fecha",
         defaultValue: new Date(),
         allowNull: false,
      },
      pedidoTotal: {
         type: DataTypes.DECIMAL(5, 2),
         field: "total",
         allowNull: false,
      },
      pedidoNombreCliente: {
         type: DataTypes.STRING,
         field: "nombre_cliente",
         allowNull: false,
      },
      pedidoDocumentoCliente: {
         type: DataTypes.STRING(12),
         field: "documento_cliente",
         allowNull: false,
      },
   },
   {
      modelName: "pedidos",
   }
);

const detalleModel = connection.define(
   "detalle",
   {
      detalleId: {
         type: DataTypes.INTEGER,
         field: "id",
         primaryKey: true,
         autoIncrement: true,
         unique: true,
      },
      detalleCantidad: {
         type: DataTypes.INTEGER,
         field: "cantidad",
         allowNull: false,
      },
      detalleSubTotal: {
         type: DataTypes.DECIMAL(5, 2),
         field: "sub_total",
         allowNull: false,
      },
   },
   {
      modelName: "detalles",
      timestamps: false,
   }
);
