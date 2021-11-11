import { IsEmail, IsString } from "class-validator"
import jwt from "jsonwebtoken"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const validated = await validator(AdminResetPasswordRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const user = await userService.retrieveByEmail(validated.email)

  const decodedToken = jwt.verify(validated.token, user.password_hash) as {
    user_id: string
  }

  if (!decodedToken || decodedToken.user_id !== user.id) {
    res.status(401).send("Invalid or expired password reset token")
    return
  }

  const data = await userService.setPassword(user.id, validated.password)

  res.status(200).json({ user: data })
}

export class AdminResetPasswordRequest {
  @IsEmail()
  email: string
  @IsString()
  token: string
  @IsString()
  password: string
}
