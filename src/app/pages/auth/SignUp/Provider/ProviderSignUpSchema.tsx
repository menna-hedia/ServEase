import * as zod from "zod";

export const providerSignUpSchema = zod
  .object({
    firstName: zod
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: zod
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: zod
      .string()
      .trim()
      .email("Invalid email address"),

    mobileNumber: zod
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),

    dob: zod.string().min(1, "Date of birth is required"),

    nationalNumber: zod
      .string()
      .regex(/^[0-9]{14}$/, "National number must be 14 digits"),

    service: zod.string().min(1, "Service is required"),

    specialization: zod
      .string()
      .min(10, "Specialization must be at least 10 characters"),

    writtenCv: zod.string().optional(),

    state: zod.string().min(1, "State is required"),

    city: zod.string().min(1, "City is required"),

    gender: zod.string().min(1, "Gender is required"),

    hourPrice: zod
      .number("Hour price must be a number" )
      .min(1, "Hour price must be at least 1"),

    password: zod
      .string()
      .max(8, "Password must be max 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase and number"
      ),

    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProviderSignUpObjectType = zod.infer<typeof providerSignUpSchema>;