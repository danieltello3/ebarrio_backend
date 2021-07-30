import { DataTypes } from "sequelize";
import { connection } from "../config/sequelize";
import { hashSync } from "bcrypt";

const usuarioModel = () =>
   connection.define(
      "usuarios",
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
               is: [/([a-zA-Z])\w+([ ])*/],
            },
         },
         usuarioApellido: {
            type: DataTypes.STRING,
            field: "apellido",
            allowNull: false,
            validate: {
               is: [/([a-zA-Z])\w+\s*/],
            },
         },
         usuarioTelefono: {
            type: DataTypes.STRING,
            field: "telefono",
            validate: {
               is: [/([0-9]{9})*/],
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
            set(valor) {
               const passwordEncriptada = hashSync(String(valor), 10);
               this.setDataValue("usuarioPassword", passwordEncriptada);
            },
         },
      },
      {
         modelName: "usuarios",
      }
   );

const tipoModel = () =>
   connection.define(
      "tipos",
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

const direccionModel = () =>
   connection.define(
      "direcciones",
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

const pedidoModel = () =>
   connection.define(
      "pedidos",
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
            type: DataTypes.DECIMAL,
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

const detalleModel = () =>
   connection.define(
      "detalles",
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
            type: DataTypes.DECIMAL,
            field: "sub_total",
            allowNull: false,
         },
      },
      {
         modelName: "detalles",
         timestamps: false,
      }
   );

const productoModel = () =>
   connection.define(
      "productos",
      {
         productoId: {
            type: DataTypes.INTEGER,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            unique: true,
         },
         productoNombre: {
            type: DataTypes.STRING,
            field: "nombre",
            allowNull: false,
         },
         productoPrecio: {
            type: DataTypes.DECIMAL,
            field: "precio",
            allowNull: false,
         },
         productoCodigo: {
            type: DataTypes.STRING,
            field: "codigo",
            allowNull: false,
         },
         productoDescripcion: {
            type: DataTypes.TEXT,
            field: "descripcion",
            allowNull: false,
         },
         productoCantidad: {
            type: DataTypes.INTEGER,
            field: "cantidad",
            allowNull: false,
            defaultValue: 0,
         },
      },
      {
         modelName: "productos",
      }
   );

const categoriaModel = () =>
   connection.define(
      "categorias",
      {
         categoriaId: {
            type: DataTypes.INTEGER,
            field: "categoria",
            primaryKey: true,
            autoIncrement: true,
            unique: true,
         },
         categoriaNombre: {
            type: DataTypes.STRING,
            field: "nombre",
            allowNull: false,
         },
      },
      {
         modelName: "categorias",
         timestamps: false,
      }
   );

const servicioModel = () =>
   connection.define(
      "servicios",
      {
         servicioId: {
            type: DataTypes.INTEGER,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            unique: true,
         },
         servicioNombre: {
            type: DataTypes.INTEGER,
            field: "nombre",
            allowNull: false,
         },
         servicioPrecio: {
            type: DataTypes.DECIMAL,
            field: "precio",
            allowNull: false,
         },
         servicioCodigo: {
            type: DataTypes.STRING,
            field: "codigo",
            allowNull: false,
         },
         servicioDescripcion: {
            type: DataTypes.TEXT,
            field: "descripcion",
            allowNull: false,
         },
         servicioDisponibilidad: {
            type: DataTypes.BOOLEAN,
            field: "disponibilidad",
            defaultValue: false,
         },
      },
      {
         modelName: "servicios",
      }
   );

const imagenModel = () =>
   connection.define(
      "imagenes",
      {
         imagenId: {
            type: DataTypes.INTEGER,
            field: "id",
            primaryKey: true,
            autoIncrement: true,
            unique: true,
         },
         imagenNombre: {
            type: DataTypes.STRING,
            field: "nombre",
            allowNull: false,
         },
         imagenExtension: {
            type: DataTypes.STRING,
            field: "extension",
            allowNull: false,
         },
         imagenPath: {
            type: DataTypes.STRING,
            field: "path",
            allowNull: false,
         },
      },
      {
         modelName: "imagenes",
      }
   );

const blackListModel = () =>
   connection.define(
      "blacklists",
      {
         blackListToken: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
         },
      },
      {
         tableName: "black_list",
         timestamps: false,
      }
   );
export const Usuario = usuarioModel();
export const Tipo = tipoModel();
export const Direccion = direccionModel();
export const Pedido = pedidoModel();
export const Detalle = detalleModel();
export const Categoria = categoriaModel();
export const Producto = productoModel();
export const Servicio = servicioModel();
export const Imagen = imagenModel();
export const BlackList = blackListModel();

Tipo.hasOne(Usuario, {
   foreignKey: { name: "tipoId", field: "tipo_id" },
});
Usuario.belongsTo(Tipo, { foreignKey: { name: "tipoId", field: "tipo_id" } });

Usuario.hasOne(Direccion, {
   foreignKey: { name: "usuarioId", field: "usuario_id" },
});
Direccion.belongsTo(Usuario, {
   foreignKey: { name: "usuarioId", field: "usuario_id" },
});

Usuario.hasMany(Pedido, {
   foreignKey: { name: "usuarioId", field: "usuario_id" },
});
Pedido.belongsTo(Usuario, {
   foreignKey: { name: "usuarioId", field: "usuario_id" },
});

Pedido.hasMany(Detalle, {
   foreignKey: { name: "pedidoId", field: "pedido_id" },
});
Detalle.belongsTo(Pedido, {
   foreignKey: { name: "pedidoId", field: "pedido_id" },
});

Producto.hasMany(Detalle, {
   foreignKey: { name: "productoId", field: "producto_id" },
});
Detalle.belongsTo(Producto, {
   foreignKey: { name: "productoId", field: "producto_id" },
});

Categoria.hasMany(Producto, {
   foreignKey: { name: "categoriaId", field: "categoria_id" },
});
Producto.belongsTo(Categoria, {
   foreignKey: { name: "categoriaId", field: "categoria_id" },
});
Categoria.hasMany(Servicio, {
   foreignKey: { name: "categoriaId", field: "categoria_id" },
});
Servicio.belongsTo(Categoria, {
   foreignKey: { name: "categoriaId", field: "categoria_id" },
});

Imagen.hasOne(Servicio, {
   foreignKey: { name: "imagenId", field: "imagen_id" },
});
Servicio.belongsTo(Imagen, {
   foreignKey: { name: "imagenId", field: "imagen_id" },
});

Producto.belongsToMany(Imagen, { through: "productos_imagenes" });
Imagen.belongsToMany(Producto, { through: "productos_imagenes" });

Imagen.hasOne(Usuario, {
   foreignKey: { name: "imagenId", field: "imagen_id" },
});
Usuario.belongsTo(Imagen, {
   foreignKey: { name: "imagenId", field: "imagen_id" },
});

Usuario.hasMany(Producto, {
   foreignKey: { name: "usuarioId", field: "usuario_id" },
});
Producto.belongsTo(Usuario, {
   foreignKey: { name: "usuarioId", field: "usuario_id" },
});

//Producto.sync({ force: true });
