import * as zod from "zod";

export const customerSignUpSchema = zod
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

    dob: zod.string().refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);

      let age = today.getFullYear() - birthDate.getFullYear();

      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18;
    }, "You must be at least 18 years old"),

    state: zod.string().min(1, "State is required"),

    city: zod.string().min(1, "City is required"),

    gender: zod.string().min(1, "Gender is required"),

    password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
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


export type CustomerSignUpObjectType =
  zod.infer<typeof customerSignUpSchema>;