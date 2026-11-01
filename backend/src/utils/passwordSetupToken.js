import crypto from "node:crypto"

export const generatePasswordSetupToken = () => {
  const token = crypto.randomBytes(32).toString("hex")

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  return {
    token,
    tokenHash,
    expiresAt,
  }
}

export const hashPasswordSetupToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}
