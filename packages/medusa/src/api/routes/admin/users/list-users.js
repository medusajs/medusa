export default async (req, res) => {
  try {
    const userService = req.scope.resolve("userService")
    const users = await userService.list({})

    res.status(200).json({ users })
  } catch (err) {
    throw err
  }
}
