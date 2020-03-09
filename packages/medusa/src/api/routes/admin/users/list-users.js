export default async (req, res) => {
  // as of now, we don't have any object properties in the UserModel
  // that you can query on, hence the empty object selector
  const selector = {}

  const userService = req.scope.resolve("userService")
  let users = await userService.list(selector)
  users = users.map(async user => await userService.decorate(user, ["email"]))

  res.json(users)
}
