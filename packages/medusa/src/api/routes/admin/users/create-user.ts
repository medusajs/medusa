import { IsEmail, IsOptional, IsString } from "class-validator"
import _ from "lodash"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const validated = await validator(AdminCreateUserRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const data = _.pick(validated, ["email", "name"])

  const user = await userService.create(data, validated.password)

  res.status(200).json({ user })
}

export class AdminCreateUserRequest {
  @IsEmail()
  email: string
  @IsOptional()
  @IsString()
  name: string
  @IsString()
  password: string
}
