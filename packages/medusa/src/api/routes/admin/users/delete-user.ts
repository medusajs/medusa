import UserService from "../../../../services/user"

export default async (req, res) => {
  const { user_id } = req.params

  const userService: UserService = req.scope.resolve("userService")
  await userService.delete(user_id)

  res.status(200).send({
    id: user_id,
    object: "user",
    deleted: true,
  })
}
