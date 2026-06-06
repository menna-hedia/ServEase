import { CustomerSignUpObjectType } from "./CustomerSignUpSchema";

export async function CustomerSignUpAction(
  data: CustomerSignUpObjectType
) {
  try {
    const { confirmPassword, ...submitData } = data;

    const payload = {
      ...submitData,
      city: data.state,
      state: data.city,
      
      gender: data.gender?.toUpperCase(),
    };

    console.log("PAYLOAD:", payload);

    const res = await fetch(`/api/auth/register/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    console.log("Customer registration response:", result);

    if (res.ok) {
      const accessToken =
        result?.access_token || result?.token;

      if (accessToken) {
        localStorage.setItem(
          "access_token",
          accessToken
        );
      }

      return {
        success: true,
        data: result,
      };
    }

    return {
      success: false,
      error:
        Array.isArray(result.message)
          ? result.message.join("\n")
          : result.message ||
            result.error ||
            "Registration failed",
    };
  } catch (error) {
    console.log("Registration error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}