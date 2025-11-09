import { randomUUID } from "crypto";
import NoteData from "../../models/Note.js";
import SharedNote from "../../models/sharedModel.js";
import User from "../../models/Users.js";
import config from "../../config/index.js";
import { sendEmail, renderTemplate } from "../emailService.js";

export async function shareNoteService({
  note_id,
  sender_uuid,
  receiver_uuid,
  permission = "read",
  is_public = false,
}) {
  if (!note_id || !sender_uuid) throw new Error("Note and sender are required");

  // Verify note belongs to sender
  const note = await NoteData.findOne({
    where: { note_id, user_uuid: sender_uuid },
  });
  if (!note) throw new Error("Note not found or unauthorized");

  // Handle PUBLIC SHARE
  if (is_public) {
    if (!note.share_token) {
      note.share_token = randomUUID();
    }
    note.is_public = true;
    await note.save();

    const link = `${config.TOTAL_URL}/share/${note.share_token}`;
    return {
      message: "Note shared publicly",
      link,
      permission,
      via: ["WhatsApp", "Twitter", "Email", "Copy Link"],
    };
  }

  // Handle PRIVATE SHARE
  if (!receiver_uuid) throw new Error("Receiver ID required for private share");

  // Check for previous share
  const existingShare = await SharedNote.findOne({
    where: { note_id, receiver_uuid },
  });

  if (existingShare) {
    // Instead of error, update existing record (refresh permission/date)
    existingShare.permission = permission;
    await existingShare.save();
  } else {
    // Create new record if not shared before
    await SharedNote.create({
      note_id,
      sender_uuid,
      receiver_uuid,
      permission,
    });
  }

  // Generate a fresh unique share link (optional)
  const share_token = randomUUID();
  note.share_token = share_token;
  await note.save();

  const link = `${config.TOTAL_URL}/share/${share_token}`;

  // Send email again
  const sender = await User.findByPk(sender_uuid);
  const receiver = await User.findByPk(receiver_uuid);

  const emailHtml = await renderTemplate("shared-note", {
    receiverName: receiver?.username || "there",
    senderName: sender?.username || "Someone",
    permission,
    link,
  });

  await sendEmail(receiver.email, "A Note Has Been Shared With You", emailHtml);

  return {
    message: existingShare
      ? `Note re-shared with ${receiver.email}`
      : `Note shared privately with ${receiver.email}`,
    permission,
    can_edit: permission === "edit",
  };
}
