import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const NoteData = sequelize.define(
  "NoteData",
  {
    note_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archived: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},

    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "user_uuid",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    tableName: "Notes",
  }
);

export default NoteData;
