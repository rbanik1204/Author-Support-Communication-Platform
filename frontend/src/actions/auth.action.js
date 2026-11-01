import { redirect } from "react-router"
import { googleLoginAPI } from "../services/auth.api"
import { logoutAPI } from "../services/auth.api"

export const googleLoginAction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const credential = formData.get("credential")

    if (!credential) {
      return {
        success: false,
        message: "Google credential is required",
      }
    }

    const result = await googleLoginAPI(credential)

    if (!result.user?.role) {
      throw new Error("Invalid authentication response")
    }

    if (result.user.role === "admin") {
      return redirect("/admin")
    }

    if (result.user.role === "author") {
      return redirect("/author")
    }

    throw new Error("Unsupported account role")
  } catch (error) {
    return {
      success: false,
      message: error.message || "Unable to login",
    }
  }
}
export const logoutAction = async () => {
  await logoutAPI()
  return redirect("/")
}
