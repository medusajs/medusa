import passport from "passport"

export default () => {
  return (req, res, next) => {
    passport.authenticate(["jwt", "bearer"], { session: false })(req, res, next)
  }
}
