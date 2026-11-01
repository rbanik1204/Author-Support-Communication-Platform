//createTicketAction
import { redirect } from "react-router"
import { createAuthorTicketAPI } from "../services/tickets.api.js"

export const createTicketAction = async ({ request }) => {
  try {
    const formData = await request.formData()

    await createAuthorTicketAPI(formData)

    return redirect("/author/tickets")
  } catch (error) {
    return {
      error: error.message || "Failed to create support ticket.",
    }
  }
}
