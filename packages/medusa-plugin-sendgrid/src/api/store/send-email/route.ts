import type {
  MedusaRequest,
  MedusaResponse
} from "@medusajs/medusa";
import SendGridService from "../../../services/sendgrid";


export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const sendgridService: SendGridService = req.scope.resolve("sendgridService")
  
  await sendgridService.sendEmail({
    templateId: req.body.template_id,
    from: req.body.from,
    to: req.body.to,
    dynamicTemplateData: req.body.data || {}
  })
  res.sendStatus(200)
}
