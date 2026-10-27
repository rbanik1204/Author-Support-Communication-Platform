export function handleHomePage(req, res, next) {
  try {
    const sessionID = req.cookies.session
    if (!sessionID) {
      return res.send({
        success: false,
        message: "You are not authorised go log in!",
      })
    }
    return res.send({
      success: true,
      message: "You are authorised!",
      session: sessionID,
    })
  } catch (err) {
    err.message = "you are not authorized!"
    next(err)
  }
}
