import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SharedNote = sequelize.define("SharedNote", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  note_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Notes", key: "note_id" },
    onDelete: "CASCADE",
  },
  sender_uuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiver_uuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  permission: {
    type: DataTypes.ENUM("read", "edit"),
    defaultValue: "read",
  },
});

export default SharedNote;
