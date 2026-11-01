import express from "express"
import { requireRole } from "../middlewares/auth.middleware.js"
import { uploadTicketAttachments } from "../middlewares/upload.middleware.js"
import { handleCreateTicket } from "../controllers/ticket.controller.js"
import { handleGetAuthorTickets } from "../controllers/ticket.controller.js"
import { handleGetAuthorTicketById } from "../controllers/ticket.controller.js"
const router = express.Router()

router
  .post("/", requireRole("author"), uploadTicketAttachments, handleCreateTicket)
  .get("/", requireRole("author"), handleGetAuthorTickets)
  .get("/:ticketId", requireRole("author"), handleGetAuthorTicketById)
export { router }
