import { IsOptional, IsString } from "class-validator"
import { validator } from "medusa-core-utils"
import UserService from "../../../../services/user"

export default async (req, res) => {
  const { user_id } = req.params
  console.log(req.body)
  const validated = await validator(AdminUpdateUserRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const data = await userService.update(user_id, validated)
  res.status(200).json({ user: data })
}

export class AdminUpdateUserRequest {
  @IsString()
  @IsOptional()
  name: string
  @IsString()
  @IsOptional()
  api_token: string
}
