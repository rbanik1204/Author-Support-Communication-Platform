import API_BASE_URL from "../config/api.js"

export const getAuthorBooksAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/api/books`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch your books.")
  }

  return data
}
