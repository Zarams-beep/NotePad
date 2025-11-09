import { z } from "zod";

export const noteValidator = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),

  content: z
    .string({
      required_error: "Content is required",
    })
    .min(5, "Content must be at least 5 characters long"),

  color: z
    .string()
    .regex(
      /^#(?:[0-9a-fA-F]{3}){1,2}$/,
      "Invalid color format (use HEX, e.g. #FF5733)"
    )
    .or(z.literal("").optional()),

  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
  user_uuid: z.string().uuid("Invalid UUID format").optional(),
});
