import API_URL from "../config/api"

export const googleLoginAPI = async (credential) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Google login failed")
  }

  return data
}
