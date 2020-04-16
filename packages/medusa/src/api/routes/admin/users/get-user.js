export default async (req, res) => {
  const { user_id } = req.params

  try {
    const userService = req.scope.resolve("userService")

    let user = await userService.retrieve(user_id)
    user = await userService.decorate(user, ["email", "name"])
    res.json(user)
  } catch (error) {
    throw error
  }
}
