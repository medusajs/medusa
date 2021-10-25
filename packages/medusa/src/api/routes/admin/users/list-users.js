export default async (req, res) => {
  const userService = req.scope.resolve("userService")
  const users = await userService.list({})

  res.status(200).json({ users })
}
