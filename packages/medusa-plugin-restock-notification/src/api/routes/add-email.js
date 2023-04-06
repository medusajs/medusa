import { isObject, isEmail } from "@medusa/utils"

export default async (req, res) => {
  const { variant_id } = req.params

  const requestIsValid = isObject(req.body) && isEmail(req.body.email)

  if (!requestIsValid) {
    res.status(400).json({ message: error.message })
    return
  }

  try {
    const restockNotificationService = req.scope.resolve(
      "restockNotificationService"
    )
    await restockNotificationService.addEmail(variant_id, req.body.email)
    res.sendStatus(201)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
