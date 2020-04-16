export default async (req, res) => {
  const { user_id } = req.params

  const userService = req.scope.resolve("userService")
  const user = await userService.delete(user_id)

  if (!user) {
    res.sendStatus(404)
    return
  }

  res.status(200).send({
    id: user_id,
    object: "user",
    deleted: true,
  })
}
