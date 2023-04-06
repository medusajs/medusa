import { MedusaError } from "medusa-core-utils"
import { isObject, isString } from "@medusa/utils"

export default async (req, res) => {
  const requestIsValid =
    isObject(req.body) &&
    isString(req.body.template_id) &&
    isString(req.body.from) &&
    isString(req.body.to) &&
    (!isDefined(req.body.data) || isObject(req.body.data))

  if (!requestIsValid) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const sendgridService = req.scope.resolve("sendgridService")
    await sendgridService.sendEmail(
      req.body.template_id,
      req.body.from,
      req.body.to,
      req.body.data || {}
    )
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
