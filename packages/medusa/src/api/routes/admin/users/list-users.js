export default async (req, res) => {
  try {
    const userService = req.scope.resolve("userService")
    const data = await userService.list({})

    const users = data.map(user => userService.decorate(user, ["email"]))

    res.status(200).json(users)
  } catch (err) {
    throw err
  }
}
