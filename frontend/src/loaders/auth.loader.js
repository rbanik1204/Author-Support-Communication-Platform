//loginLoader, requireAuthorLoader, requireAdminLoader
import { redirect } from "react-router"
import { getCurrentUserAPI } from "../services/auth.api"

export const loginLoader = async () => {
  try {
    const result = await getCurrentUserAPI()

    if (result.user.role === "admin") {
      return redirect("/admin")
    }

    return redirect("/author")
  } catch {
    return null
  }
}

export const requireAuthorLoader = async () => {
  try {
    const result = await getCurrentUserAPI()

    if (result.user.role !== "author") {
      return redirect("/admin")
    }

    return result.user
  } catch {
    return redirect("/")
  }
}

export const requireAdminLoader = async () => {
  try {
    const result = await getCurrentUserAPI()

    if (result.user.role !== "admin") {
      return redirect("/author")
    }

    return result.user
  } catch {
    return redirect("/")
  }
}
