import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  if (!payload || !payload.sub) {
    throw new Error("Invalid Google token payload")
  }

  if (!payload.email || payload.email_verified !== true) {
    throw new Error("Google email is not verified")
  }

  return {
    googleSub: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name,
    picture: payload.picture,
  }
}

export default verifyGoogleToken
