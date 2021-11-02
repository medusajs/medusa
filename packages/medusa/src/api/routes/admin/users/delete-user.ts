import UserService from "../../../../services/user"

export default async (req, res) => {
  const { user_id } = req.params

  const userService = req.scope.resolve("userService") as UserService
  await userService.delete(user_id)

  res.status(200).send({
    id: user_id,
    object: "user",
    deleted: true,
  })
}
