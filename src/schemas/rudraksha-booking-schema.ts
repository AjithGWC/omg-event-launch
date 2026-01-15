import { z } from "zod";

// Regex for validation
const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian mobile number pattern

// Schema for individual family/group members
const memberSchema = z.object({
  idName: z
    .string()
    .min(2, { message: "Name is required." }),
  idAge: z.preprocess(
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
  idGender: z
    .string()
    .min(1, { message: "Gender is required." })
    .refine((val) => ["male", "female", "others"].includes(val), {
      message: "Gender must be male, female, or others.",
    }),
});

// Main booking form schema
export const rudrakshaBookingSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name is required" }),
    phoneNumber: z
      .string()
      .regex(phoneRegex, { message: "Invalid 10-digit phone number." }),
    addressText: z.string().optional(), // Will be populated from address fields
    addressPlaceId: z.string().optional(),
    addressLat: z.number().optional(),
    addressLng: z.number().optional(),
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
        .int({ message: "Age is required" })
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
    // Event participation fields
    participatingInEvent: z.boolean(),
    preferredDate: z.array(z.string()).optional(),
    preferredTimeSlot: z.record(z.union([z.string(), z.array(z.string())])).optional(),

    // Members array (only if participating)
    members: z
      .array(memberSchema)
      .max(10, { message: "You can only add up to 10 members." })
      .optional(),

    // Quantity validation
    rudrakshaQuantity: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return NaN;
        const num = Number(val);
        return isNaN(num) ? NaN : num;
      },
      z
        .number({ invalid_type_error: "Please Enter the Quantity of Rudraksha" })
        .superRefine((val, ctx) => {
          if (isNaN(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please Enter the Quantity of Rudraksha",
            });
            return;
          }
          if (val < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: 1,
              type: "number",
              inclusive: true,
              message: "Quantity must be at least 1.",
            });
          }
          if (val > 10) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: 10,
              type: "number",
              inclusive: true,
              message: "Maximum quantity is 10.",
            });
          }
        })
    ),
  })
  .superRefine((data, ctx) => {
    // If participating, validation for date and time slots
    if (data.participatingInEvent) {
      // Validate preferredDate
      if (!data.preferredDate || data.preferredDate.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select at least one preferred date.",
          path: ["preferredDate"],
        });
      } else {
        // Validate preferredTimeSlot for each selected date
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
    }
  })
  .refine(
    (data) => {
      // Validate that at least one address field is filled
      const addressParts = [
        data.addressLine1,
        data.addressLine2,
        data.city,
        data.district,
        data.state,
        data.pinCode,
      ];
      const hasAddress = addressParts.some((part) => part && part.trim() !== "");
      if (!hasAddress) {
        return false;
      }
      // Validate that combined address is at least 5 characters
      const combinedAddress = addressParts
        .filter((part) => part && part.trim() !== "")
        .join(", ");
      return combinedAddress.length >= 5;
    },
    {
      message: "Please provide a complete address (at least 5 characters).",
      path: ["addressText"],
    }
  );

export type RudrakshaBookingValues = z.infer<typeof rudrakshaBookingSchema>;

