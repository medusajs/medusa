export default async (req, res) => {
  const selector = {}

  const userService = req.scope.resolve("userService")
  const users = await userService.list(selector)

  res.json(users)
}
