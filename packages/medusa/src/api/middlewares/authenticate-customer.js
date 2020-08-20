import passport from "passport"

export default () => {
  // Always go to next
  return (req, res, next) => {
    passport.authenticate(
      ["jwt", "bearer"],
      { session: false },
      (err, user, info) => {
        if (err) {
          return next(err)
        }
        req.user = user
        return next()
      }
    )(req, res, next)
  }
}
