export default async (req, res) => {
  const { user_id } = req.params
  try {
    const userService = req.scope.resolve("userService")
    const token = await userService.generateResetPasswordToken(user_id)
    res.json(token)
  } catch (error) {
    throw error
  }
}
