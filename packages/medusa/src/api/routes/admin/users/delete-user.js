export default async (req, res) => {
  const { user_id } = req.params

  const userService = req.scope.resolve("userService")
  await userService.delete(user_id)

  res.status(200).send({
    id: user_id,
    object: "user",
    deleted: true,
  })
}
