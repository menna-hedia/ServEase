export type AuthRole = "customer" | "provider";
export type AuthOTPType = "register" | "reset-password";

export interface AuthUser {
  email: string;
  password: string;
  role: AuthRole;
  verified: boolean;
  approved: boolean;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  [key: string]: any;
}

interface AuthOTPEntry {
  email: string;
  code: string;
  type: AuthOTPType;
  role?: AuthRole;
  expiresAt: number;
}

const USERS_KEY = "servEase_users";
const OTP_KEY = "servEase_otps";

function loadUsers(): AuthUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadOtps(): AuthOTPEntry[] {
  try {
    return JSON.parse(sessionStorage.getItem(OTP_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOtps(otps: AuthOTPEntry[]) {
  sessionStorage.setItem(OTP_KEY, JSON.stringify(otps));
}

function findUser(email: string) {
  const users = loadUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function generateOTP() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function createOrUpdateOtp(email: string, type: AuthOTPType, role?: AuthRole) {
  const otps = loadOtps().filter((entry) => entry.email !== email);
  const otpEntry: AuthOTPEntry = {
    email,
    code: generateOTP(),
    type,
    role,
    expiresAt: Date.now() + 1000 * 60 * 10,
  };
  otps.push(otpEntry);
  saveOtps(otps);
  return otpEntry;
}

function getOtpEntry(email: string) {
  const otps = loadOtps();
  return otps.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
}

function removeOtpEntry(email: string) {
  const otps = loadOtps().filter((entry) => entry.email.toLowerCase() !== email.toLowerCase());
  saveOtps(otps);
}

function createFakeToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function registerCustomer(data: Partial<AuthUser>) {
  const email = data.email?.toLowerCase();
  if (!email || !data.password) {
    return { success: false, error: "Invalid registration data" };
  }

  if (findUser(email)) {
    return { success: false, error: "Email already exists" };
  }

  const users = loadUsers();
  const newUser: AuthUser = {
    email,
    password: data.password,
    role: "customer",
    verified: false,
    approved: true,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    displayName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    data: {
      user: newUser,
      access_token: createFakeToken(),
      refresh_token: createFakeToken(),
    },
  };
}

export async function registerProvider(data: Partial<AuthUser>) {
  const email = data.email?.toLowerCase();
  if (!email || !data.password) {
    return { success: false, error: "Invalid registration data" };
  }

  if (findUser(email)) {
    return { success: false, error: "Email already exists" };
  }

  const users = loadUsers();
  const newUser: AuthUser = {
    email,
    password: data.password,
    role: "provider",
    verified: false,
    approved: false,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    displayName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    data: {
      user: newUser,
      access_token: createFakeToken(),
      refresh_token: createFakeToken(),
    },
  };
}

export async function sendVerificationOTP(email: string, role: AuthRole) {
  const user = findUser(email);
  if (!user) {
    return { success: false, error: "No account found for this email" };
  }

  const otpEntry = createOrUpdateOtp(email, "register", role);
  return {
    success: true,
    message: "OTP sent successfully",
    otp: otpEntry.code,
  };
}

export async function resendOTP(email: string) {
  const entry = getOtpEntry(email);
  if (!entry) {
    return { success: false, error: "No OTP request found" };
  }

  const otpEntry = createOrUpdateOtp(email, entry.type, entry.role);
  return {
    success: true,
    message: "OTP resent successfully",
    otp: otpEntry.code,
  };
}

export async function sendPasswordResetOTP(email: string) {
  const user = findUser(email);
  if (!user) {
    return { success: false, error: "No account found for this email" };
  }

  const otpEntry = createOrUpdateOtp(email, "reset-password", user.role);
  return {
    success: true,
    message: "Password reset OTP sent successfully",
    otp: otpEntry.code,
  };
}

export async function confirmEmailOTP(email: string, otp: string) {
  const entry = getOtpEntry(email);
  if (!entry || entry.type !== "register") {
    return { success: false, error: "No registration OTP found" };
  }

  if (entry.expiresAt < Date.now()) {
    removeOtpEntry(email);
    return { success: false, error: "OTP expired. Please resend." };
  }

  if (entry.code !== otp) {
    return { success: false, error: "Invalid OTP" };
  }

  const users = loadUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { success: false, error: "User not found" };
  }

  user.verified = true;
  saveUsers(users);
  removeOtpEntry(email);

  return {
    success: true,
    message: "Email verified successfully",
    user,
  };
}

export async function checkForgetPasswordOTP(email: string, otp: string) {
  const entry = getOtpEntry(email);
  if (!entry || entry.type !== "reset-password") {
    return { success: false, error: "No password reset OTP found" };
  }

  if (entry.expiresAt < Date.now()) {
    removeOtpEntry(email);
    return { success: false, error: "OTP expired. Please resend." };
  }

  if (entry.code !== otp) {
    return { success: false, error: "Invalid OTP" };
  }

  return {
    success: true,
    message: "OTP verified successfully",
  };
}

export async function changePasswordAfterOTP(
  email: string,
  otp: string,
  newPassword: string
) {
  const entry = getOtpEntry(email);
  if (!entry || entry.type !== "reset-password") {
    return { success: false, error: "No password reset OTP found" };
  }

  if (entry.expiresAt < Date.now()) {
    removeOtpEntry(email);
    return { success: false, error: "OTP expired. Please resend." };
  }

  if (entry.code !== otp) {
    return { success: false, error: "Invalid OTP" };
  }

  const users = loadUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { success: false, error: "User not found" };
  }

  user.password = newPassword;
  saveUsers(users);
  removeOtpEntry(email);

  return {
    success: true,
    message: "Password changed successfully",
  };
}

export async function login(data: {
  email: string;
  password: string;
}) {
  const user = findUser(data.email);
  if (!user) {
    return { success: false, error: "No account found for this email" };
  }

  if (user.password !== data.password) {
    return { success: false, error: "Incorrect password" };
  }

  if (!user.verified) {
    return { success: false, error: "Please verify your email before signing in" };
  }

  return {
    success: true,
    data: {
      user,
      access_token: createFakeToken(),
      refresh_token: createFakeToken(),
    },
  };
}
