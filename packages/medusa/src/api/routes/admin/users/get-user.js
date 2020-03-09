export default async (req, res) => {
  const { id } = req.params

  const userService = req.scope.resolve("userService")
  let user = await userService.retrieve(id)

  if (!user) {
    res.sendStatus(404)
    return
  }

  user = await userService.decorate(user, ["email"])
  res.json(user)
}
