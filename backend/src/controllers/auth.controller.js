import verifyGoogleToken from "../services/googleAuth.service.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { hashPasswordSetupToken } from "../utils/passwordSetupToken.js"
export function handleUserRegister(req, res, next) {
  return res.json({
    success: true,
    message: "End point connected!",
  })
}
export const handleSetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Invitation token and password are required.",
      })
    }

    if (
      typeof password !== "string" ||
      Buffer.byteLength(password, "utf8") < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 12 and 72 bytes.",
      })
    }

    const tokenHash = hashPasswordSetupToken(token)

    const user = await User.findOne({
      passwordSetupTokenHash: tokenHash,
      passwordSetupExpiresAt: { $gt: new Date() },
      isPasswordSet: false,
    }).select("+passwordSetupTokenHash +passwordSetupExpiresAt")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invitation link.",
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    user.passwordHash = passwordHash
    user.isPasswordSet = true

    user.passwordSetupTokenHash = undefined
    user.passwordSetupExpiresAt = undefined

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Password setup completed. You can now log in.",
    })
  } catch (error) {
    next(error)
  }
}
const createUserSession = (req, res, user, next) => {
  req.session.regenerate((err) => {
    if (err) return next(err)
    console.log("LOGIN USER ID:", user._id.toString())
    console.log("LOGIN USER EMAIL:", user.email)
    req.session.user = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
    }

    req.session.save((err) => {
      if (err) return next(err)

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    })
  })
}
export const handleUserLogin = async (req, res, next) => {
  try {
    const { credential, email, password } = req.body

    // Google OAuth login
    if (credential) {
      const googleUser = await verifyGoogleToken(credential)

      const user = await User.findOne({
        email: googleUser.email,
      })

      if (!user) {
        return res.status(403).json({
          success: false,
          message: "This Google account is not registered with BookLeaf.",
        })
      }

      if (user.google_sub && user.google_sub !== googleUser.googleSub) {
        return res.status(403).json({
          success: false,
          message: "Google account does not match the linked account.",
        })
      }

      if (!user.google_sub) {
        user.google_sub = googleUser.googleSub
        await user.save()
      }

      return createUserSession(req, res, user, next)
    }

    // Email/password login
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await User.findOne({
      email: normalizedEmail,
      isPasswordSet: true,
    }).select("+passwordHash")

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
    }

    return createUserSession(req, res, user, next)
  } catch (error) {
    next(error)
  }
}

export const handleGetMe = async (req, res, next) => {
  try {
    const sessionUser = req.session?.user

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
    }

    const user = await User.findById(sessionUser._id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      })
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const handleUserLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err)

    res.clearCookie("bookleaf.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    })
  })
}
