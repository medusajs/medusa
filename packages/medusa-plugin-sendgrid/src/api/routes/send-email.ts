import {
  MedusaRequest,
  MedusaResponse
} from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const sendgridService = req.scope.resolve("sendgridService")
  await sendgridService.sendEmail(
    req.body.template_id,
    req.body.from,
    req.body.to,
    req.body.data || {}
  )
  res.sendStatus(200)
}
