export default async (req, res) => {
  const { id } = req.params

  try {
    const userService = req.scope.resolve("userService")

    let user = await userService.retrieve(id)
    user = await userService.decorate(user, ["email"])
    res.json(user)
  } catch (error) {
    throw error
  }
}
