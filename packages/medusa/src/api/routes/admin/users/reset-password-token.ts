import { validator } from "medusa-core-utils"
import UserService from "../../../../services/user"

export default async (req, res) => {
  const validated = await validator(AdminResetPasswordTokenRequest, req.body)

  const userService = req.scope.resolve("userService") as UserService
  const user = await userService.retrieveByEmail(validated.email)

  // Should call a email service provider that sends the token to the user
  await userService.generateResetPasswordToken(user.id)

  res.sendStatus(204)
}

export class AdminResetPasswordTokenRequest {
  email: string
}
