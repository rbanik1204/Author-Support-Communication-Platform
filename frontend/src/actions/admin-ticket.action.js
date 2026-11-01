import { redirect } from "react-router"

import {
  updateTicketStatusAPI,
  assignTicketToSelfAPI,
  createAdminMessageAPI,
  generateAdminTicketDraftAPI,
} from "../services/admin-ticket.api.js"

// UPDATE TICKET STATUS
export const updateTicketStatusAction = async ({ request, params }) => {
  try {
    const formData = await request.formData()
    const status = formData.get("status")

    await updateTicketStatusAPI(params.ticketId, status)

    return {
      success: true,
      message: "Ticket status updated successfully.",
    }
  } catch (error) {
    return {
      error: error.message || "Failed to update ticket status.",
    }
  }
}

// ASSIGN TICKET TO CURRENT ADMIN
export const assignTicketAction = async ({ params }) => {
  try {
    await assignTicketToSelfAPI(params.ticketId)

    return {
      success: true,
      message: "Ticket assigned to you successfully.",
    }
  } catch (error) {
    return {
      error: error.message || "Failed to assign ticket.",
    }
  }
}

// SEND PUBLIC REPLY
export const adminReplyAction = async ({ request, params }) => {
  try {
    const formData = await request.formData()
    const content = formData.get("content")

    if (typeof content !== "string" || !content.trim()) {
      return { error: "Reply content is required." }
    }

    await createAdminMessageAPI(params.ticketId, content.trim(), "admin_reply")

    return {
      success: true,
      message: "Reply sent successfully.",
    }
  } catch (error) {
    return {
      error: error.message || "Failed to send reply.",
    }
  }
}

// ADD INTERNAL NOTE
export const internalNoteAction = async ({ request, params }) => {
  try {
    const formData = await request.formData()
    const content = formData.get("content")

    if (typeof content !== "string" || !content.trim()) {
      return { error: "Internal note content is required." }
    }

    await createAdminMessageAPI(
      params.ticketId,
      content.trim(),
      "internal_note"
    )

    return {
      success: true,
      message: "Internal note added successfully.",
    }
  } catch (error) {
    return {
      error: error.message || "Failed to add internal note.",
    }
  }
}
export const adminTicketAction = async ({ request, params }) => {
  try {
    const formData = await request.formData()
    const intent = formData.get("intent")

    switch (intent) {
      case "update-status": {
        const status = formData.get("status")

        await updateTicketStatusAPI(params.ticketId, status)

        return {
          success: true,
          message: "Ticket status updated.",
        }
      }

      case "assign-ticket": {
        await assignTicketToSelfAPI(params.ticketId)

        return {
          success: true,
          message: "Ticket assigned successfully.",
        }
      }

      case "send-reply": {
        const content = formData.get("content")

        if (typeof content !== "string" || !content.trim()) {
          return { error: "Reply content is required." }
        }

        await createAdminMessageAPI(
          params.ticketId,
          content.trim(),
          "admin_reply"
        )

        return {
          success: true,
          message: "Reply sent successfully.",
        }
      }

      case "add-internal-note": {
        const content = formData.get("content")

        if (typeof content !== "string" || !content.trim()) {
          return { error: "Internal note content is required." }
        }

        await createAdminMessageAPI(
          params.ticketId,
          content.trim(),
          "internal_note"
        )

        return {
          success: true,
          message: "Internal note added successfully.",
        }
      }
      case "generate-draft": {
        const result = await generateAdminTicketDraftAPI(params.ticketId)

        return {
          success: true,
          message: result.message,
          draft: result.data.draft,
        }
      }
      default:
        return { error: "Invalid admin ticket action." }
    }
  } catch (error) {
    return {
      error: error.message || "Admin ticket operation failed.",
    }
  }
}
