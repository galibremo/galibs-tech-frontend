import { z } from "zod";
import {
  validateString,
  validateEmail,
  validateEnum,
  validateOptionalString,
} from "@/validators/common-rule";

export const checkoutSchema = z.object({
  firstName: validateString("First Name", { min: 1 }),
  lastName: validateString("Last Name", { min: 1 }),
  address: validateString("Address", { min: 1 }),
  upazilaThana: validateString("Upazila/Thana", { min: 1 }),
  district: validateString("District", { min: 1 }),
  mobile: validateString("Mobile Number", { min: 11 }),
  email: validateEmail,
  comment: validateOptionalString("Comment"),
  paymentMethod: validateEnum("Payment Method", ["COD", "ONLINE", "POS"] as const),
  deliveryMethod: validateEnum("Delivery Method", ["HOME", "PICKUP", "EXPRESS"] as const),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions to place an order",
  }),
});

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
