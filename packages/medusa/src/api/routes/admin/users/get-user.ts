import UserService from "../../../../services/user"

export default async (req, res) => {
  const { user_id } = req.params

  const userService = req.scope.resolve("userService") as UserService

  const user = await userService.retrieve(user_id)
  res.json({ user })
}
