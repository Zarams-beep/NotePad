import Note from "./Note";
import User from "./Users";
import SharedNote from "./sharedModel";

User.hasMany(Note, { foreignKey: "user_uuid", onDelete: "CASCADE" });
Note.belongsTo(User, { foreignKey: "user_uuid" });

// A user can share many notes
User.hasMany(SharedNote, {
  foreignKey: "sender_uuid",
  as: "sharedNotesSent",
});

// A user can receive many shared notes
User.hasMany(SharedNote, {
  foreignKey: "receiver_uuid",
  as: "sharedNotesReceived",
});

// A shared note belongs to one note
SharedNote.belongsTo(Note, {
  foreignKey: "note_id",
  as: "note",
});

// Each note can be shared multiple times
Note.hasMany(SharedNote, {
  foreignKey: "note_id",
  as: "sharedWith",
});

export { User, Note, SharedNote };
