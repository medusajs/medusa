import { IsObject, IsEmail } from "class-validator"
import { validator } from "@medusajs/utils"

export default async (req, res) => {
  const validated = await validator(SubscribeNewsletterReq, req.body)

  try {
    const mailchimpService = req.scope.resolve("mailchimpService")
    await mailchimpService.subscribeNewsletter(
      validated.email,
      validated.data || {}
    )
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}

class SubscribeNewsletterReq {
  @IsEmail
  email

  @IsObject
  @IsOptional
  data
}
