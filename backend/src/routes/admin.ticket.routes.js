import express from "express"
import { requireRole } from "../middlewares/auth.middleware.js"
import {
  handleGetAdminTickets,
  handleGetAdminTicketById,
  handleUpdateTicketStatus,
  handleAssignTicketToSelf,
  handleCreateAdminMessage,
  handleGenerateTicketDraft,
  handleUpdateTicketClassification,
} from "../controllers/admin.ticket.controller.js"

const router = express.Router()

router
  .get("/", requireRole("admin"), handleGetAdminTickets)
  .patch("/:ticketId/status", requireRole("admin"), handleUpdateTicketStatus)
  .patch("/:ticketId/assign", requireRole("admin"), handleAssignTicketToSelf)
  .post("/:ticketId/messages", requireRole("admin"), handleCreateAdminMessage)
  .get("/:ticketId", requireRole("admin"), handleGetAdminTicketById)
  .post("/:ticketId/draft", requireRole("admin"), handleGenerateTicketDraft)
  .patch(
    "/:ticketId/classification",
    requireRole("admin"),
    handleUpdateTicketClassification
  )
export { router }
