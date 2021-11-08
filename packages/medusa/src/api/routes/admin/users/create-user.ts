import { IsEmail } from "class-validator"
import _ from "lodash"
import { validator } from "medusa-core-utils"
import { User } from "../../../.."
import UserService from "../../../../services/user"

export default async (req, res) => {
  const validated = await validator(AdminCreateUserRequest, req.body)

  const userService = req.scope.resolve("userService") as UserService
  const data = _.pick(validated, ["email", "name"])

  const user = await userService.create(data, validated.password)

  res.status(200).json({ user })
}

export class AdminCreateUserRequest {
  @IsEmail()
  email: string
  name?: string
  password: string
}

export type AdminCreateUserResponse = {
  user: Omit<User, "password_hash">
}
