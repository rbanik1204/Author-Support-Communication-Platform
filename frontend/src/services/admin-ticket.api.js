import API_BASE_URL from "../config/api.js"

// GET: Admin ticket queue
export const getAdminTicketsAPI = async (filters = {}) => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value)
    }
  })

  const response = await fetch(
    `${API_BASE_URL}/api/admin/tickets?${params.toString()}`,
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

// GET: Individual ticket details
export const getAdminTicketByIdAPI = async (ticketId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/tickets/${ticketId}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch ticket details.")
  }

  return data
}

// PATCH: Update ticket status
export const updateTicketStatusAPI = async (ticketId, status) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/tickets/${ticketId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to update ticket status.")
  }

  return data
}

// PATCH: Assign ticket to current admin
export const assignTicketToSelfAPI = async (ticketId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/tickets/${ticketId}/assign`,
    {
      method: "PATCH",
      credentials: "include",
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to assign ticket.")
  }

  return data
}

// POST: Public reply or internal note
export const createAdminMessageAPI = async (ticketId, content, type) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/tickets/${ticketId}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, type }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to send message.")
  }

  return data
}
