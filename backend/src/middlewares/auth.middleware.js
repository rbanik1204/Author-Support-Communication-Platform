export const requireAuth = (req, res, next) => {
  if (!req.session?.user?._id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    })
  }

  next()
}

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session?.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      })
    }

    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource.",
      })
    }

    next()
  }
}
