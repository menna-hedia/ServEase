import * as zod from "zod";

export const SignInSchema = zod.object({
  email: zod
    .string()
    .email("Email isn't in format")
    .nonempty("Email is required"),

  password: zod
    .string()
    .nonempty("Password is required"),
});

export type SignInObjectType = zod.infer<typeof SignInSchema>;