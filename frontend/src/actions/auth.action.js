import { redirect } from "react-router"

import {
  googleLoginAPI,
  passwordLoginAPI,
  logoutAPI,
} from "../services/auth.api"

export const loginAction = async ({ request }) => {
  try {
    const formData = await request.formData()

    const credential = formData.get("credential")
    const email = formData.get("email")
    const password = formData.get("password")

    let result

    if (credential) {
      result = await googleLoginAPI(credential)
    } else if (email && password) {
      result = await passwordLoginAPI(email, password)
    } else {
      return {
        success: false,
        message: "Please provide your login credentials.",
      }
    }

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
