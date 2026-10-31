import verifyGoogleToken from "../services/googleAuth.service.js"
import User from "../models/user.model.js"
export function handleUserRegister(req, res, next) {
  return res.json({
    success: true,
    message: "End point connected!",
  })
}

export const handleUserLogin = async (req, res, next) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      })
    }

    const googleUser = await verifyGoogleToken(credential)

    const user = await User.findOne({
      email: googleUser.email,
    })

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "This Google account is not registered with BookLeaf",
      })
    }

    if (user.google_sub && user.google_sub !== googleUser.googleSub) {
      return res.status(403).json({
        success: false,
        message: "Google account does not match the linked account",
      })
    }

    if (!user.google_sub) {
      user.google_sub = googleUser.googleSub
      await user.save()
    }

    req.session.regenerate((err) => {
      if (err) {
        return next(err)
      }

      req.session.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      }

      req.session.save((err) => {
        if (err) {
          return next(err)
        }

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

    const user = await User.findById(sessionUser.id).select(
      "_id name email role"
    )

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
