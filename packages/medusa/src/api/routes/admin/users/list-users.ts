import UserService from "../../../../services/user"

export default async (req, res) => {
  const userService = req.scope.resolve("userService") as UserService
  const users = await userService.list({})

  res.status(200).json({ users })
}
