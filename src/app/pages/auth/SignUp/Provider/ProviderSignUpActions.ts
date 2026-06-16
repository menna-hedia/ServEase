export async function ProviderSignUpAction(
  formData: FormData
) {
  try {
    const res = await fetch(
      "/api/auth/register/provider",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();

    console.log("Registration response:", result);

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
      error: Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message ||
        "Registration failed",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error",
    };
  }
}