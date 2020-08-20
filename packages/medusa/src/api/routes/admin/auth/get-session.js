import passport from "passport"

export default async (req, res) => {
  const userService = req.scope.resolve("userService")
  const user = await userService.retrieve(req.user.userId)
  res.status(200).json({ user })
}
