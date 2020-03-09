export default async (req, res) => {
  const { id } = req.params

  const userService = req.scope.resolve("userService")
  const user = await userService.delete(id)

  if (!user) {
    res.sendStatus(404)
    return
  }

  res.status(200).send({
    id,
    object: "user",
    deleted: true,
  })
}
