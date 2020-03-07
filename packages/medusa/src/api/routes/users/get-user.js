export default async (req, res) => {
  const { id } = req.params

  const userService = req.scope.resolve("userService")
  const user = await userService.retrieve(id)

  if (!user) {
    res.sendStatus(404)
    return
  }

  res.json(user)
}
