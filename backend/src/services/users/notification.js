import { sendEmail, renderTemplate } from "../emailService.js";

export async function sendEmailChangeNotification(
  oldEmail,
  newEmail,
  username
) {
  const html = await renderTemplate("email-changed", {
    username,
    oldEmail,
    newEmail,
    date: new Date().toLocaleString(),
  });

  const text = `Hello ${username},\n\nYour email was changed from ${oldEmail} to ${newEmail} on ${new Date().toLocaleString()}.\n\nIf you did not make this change, please contact support immediately.`;

  // Send to OLD email
  await sendEmail(oldEmail, "Email Address Changed", html, text);

  // Send welcome to NEW email
  const welcomeHtml = await renderTemplate("email-change-confirmation", {
    username,
    newEmail,
  });

  const welcomeText = `Hello ${username},\n\nYour email has been successfully updated to ${newEmail}.\n\nYou will now receive all notifications at this address.`;

  await sendEmail(newEmail, "Email Address Updated", welcomeHtml, welcomeText);
}
