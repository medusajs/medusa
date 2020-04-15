export default async (req, res) => {
  const { id } = req.params
  try {
    const userService = req.scope.resolve("userService")
    const token = await userService.generateResetPasswordToken(id)
    if (!token) {
      res.sendStatus(404)
      return
    }
    res.json(token)
  } catch (error) {
    throw error
  }
}
