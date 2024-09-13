import conn from "../config/conn.js";
import { DataTypes } from "sequelize";

const Usuarios = conn.define(
  "usuarios",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: false,
      required: false,
    },
    papel: {
      type: DataTypes.ENUM,
      defaultValue: "leitor",
      values: ['administrador', 'autor', 'leitor'],
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
  }
);

export default Usuarios;
