// (authorTicketsLoader,
//   authorTicketDetailsLoader,
//   adminTicketQueueLoader,
//   adminTicketDetailsLoader)

import {
  getAuthorTicketsAPI,
  getAuthorTicketByIdAPI,
} from "../services/tickets.api.js"

import {
  getAdminTicketsAPI,
  getAdminTicketByIdAPI,
} from "../services/admin-ticket.api.js"

// AUTHOR: Ticket listing
export const authorTicketsLoader = async ({ request }) => {
  const url = new URL(request.url)

  const page = Number(url.searchParams.get("page")) || 1
  const limit = Number(url.searchParams.get("limit")) || 10

  const data = await getAuthorTicketsAPI(page, limit)

  return {
    tickets: data.data.tickets,
    pagination: data.data.pagination,
  }
}

// AUTHOR: Individual ticket details
export const authorTicketDetailsLoader = async ({ params }) => {
  const data = await getAuthorTicketByIdAPI(params.ticketId)

  return {
    ticket: data.data.ticket,
    messages: data.data.messages,
  }
}

// ADMIN: Ticket queue
export const adminTicketQueueLoader = async ({ request }) => {
  const url = new URL(request.url)

  const filters = {
    page: Number(url.searchParams.get("page")) || 1,
    limit: Number(url.searchParams.get("limit")) || 10,
    status: url.searchParams.get("status") || "",
    category: url.searchParams.get("category") || "",
    priority: url.searchParams.get("priority") || "",
    search: url.searchParams.get("search") || "",
  }

  const data = await getAdminTicketsAPI(filters)

  return {
    tickets: data.data.tickets,
    pagination: data.data.pagination,
  }
}

// ADMIN: Individual ticket details
export const adminTicketDetailsLoader = async ({ params }) => {
  const data = await getAdminTicketByIdAPI(params.ticketId)

  return {
    ticket: data.data.ticket,
    messages: data.data.messages,
  }
}
