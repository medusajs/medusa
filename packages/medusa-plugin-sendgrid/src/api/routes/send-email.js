import { IsString, IsObject } from "class-validator"
import { validator } from "@medusajs/utils"

export default async (req, res) => {
  const validated = await validator(SendEmailReq, req.body)

  try {
    const sendgridService = req.scope.resolve("sendgridService")
    await sendgridService.sendEmail(
      validated.template_id,
      validated.from,
      validated.to,
      validated.data
    )
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}

class SendEmailReq {
  @IsString()
  template_id

  @IsString()
  from

  @IsString()
  to

  @IsObject()
  @IsOptional()
  data
}
