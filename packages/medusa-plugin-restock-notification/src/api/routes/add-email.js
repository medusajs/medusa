import { IsEmail } from "class-validator"
import { validator } from "@medusajs/utils"

export default async (req, res) => {
  const { variant_id } = req.params

  const validated = await validator(AddEmailReq, req.body)

  try {
    const restockNotificationService = req.scope.resolve(
      "restockNotificationService"
    )
    await restockNotificationService.addEmail(variant_id, validated.email)
    res.sendStatus(201)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

class AddEmailReq {
  @IsEmail
  email
}
