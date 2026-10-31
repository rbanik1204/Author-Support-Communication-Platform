import { redirect } from "react-router"
import { googleLoginAPI } from "../services/auth.api"

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

    if (result.user.role === "admin") {
      return redirect("/admin")
    }

    return redirect("/author")
  } catch (error) {
    return {
      success: false,
      message: error.message || "Unable to login",
    }
  }
}
