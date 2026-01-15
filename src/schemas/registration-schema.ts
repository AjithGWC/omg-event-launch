import { z } from "zod";

// Regex for validation
const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian mobile number pattern

// Schema for individual family/group members
const memberSchema = z.object({
  idName: z
    .string()
    .min(2, { message: "Member name is required." }),
  idAge: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z
      .number()
      .int({ message: "Age is required." })
      .min(1, { message: "Age must be at least 1." })
      .max(150, { message: "Please enter valid age." })
      .optional()
  ),
  idGender: z
    .string()
    .min(1, { message: "Gender is required." })
    .refine((val) => ["male", "female", "others"].includes(val), {
      message: "Gender must be male, female, or others.",
    }),
});

// Main form schema
export const registrationFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Name is required." }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
    .max(10, { message: "Phone number cannot exceed 10 digits." }),
  // .regex(phoneRegex, { message: "Invalid 10-digit phone number. Must start with 6-9." }),
  addressText: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  age: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z
      .number()
      .int({ message: "Age must be a whole number." })
      .min(1, { message: "Age must be at least 1." })
      .max(150, { message: "Please enter valid age." })
      .optional()
  ),
  gender: z
    .string()
    .min(1, { message: "Gender is required." })
    .refine((val) => ["male", "female", "others"].includes(val), {
      message: "Gender must be male, female, or others.",
    }),
  preferredDate: z.array(z.string()).min(1, { message: "Please select at least one preferred date." }),
  preferredTimeSlot: z.record(z.union([z.string(), z.array(z.string())])),

  // Dynamic array with a max limit of 5
  members: z
    .array(memberSchema)
    .max(10, { message: "You can only add up to 10 members." })
    .optional(),
}).superRefine((data, ctx) => {
  if (data.preferredDate && data.preferredDate.length > 0) {
    const missingDates = data.preferredDate.filter((date) => {
      const slots = data.preferredTimeSlot?.[date];
      return !slots || (Array.isArray(slots) && slots.length === 0);
    });

    if (missingDates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please select time slots for: ${missingDates.join(", ")}`,
        path: ["preferredTimeSlot"],
      });
    }
  }
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

