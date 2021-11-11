import { IsEmail } from "class-validator"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const validated = await validator(AdminResetPasswordTokenRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const user = await userService.retrieveByEmail(validated.email)

  // Should call a email service provider that sends the token to the user
  await userService.generateResetPasswordToken(user.id)

  res.sendStatus(204)
}

export class AdminResetPasswordTokenRequest {
  @IsEmail()
  email: string
}
