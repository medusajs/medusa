import passport from "passport"

export default () => {
  return passport.authenticate(["jwt", "bearer"], { session: false })
}
