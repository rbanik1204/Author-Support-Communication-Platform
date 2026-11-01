import API_BASE_URL from "../config/api.js"

// GET: Fetch author's tickets
export const getAuthorTicketsAPI = async (page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/api/tickets?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tickets.")
  }

  return data
}

// GET: Fetch a particular ticket and its conversation
export const getAuthorTicketByIdAPI = async (ticketId) => {
  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`, {
    method: "GET",
    credentials: "include",
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch ticket details.")
  }

  return data
}

// POST: Create ticket with optional attachments
export const createAuthorTicketAPI = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to create ticket.")
  }

  return data
}
