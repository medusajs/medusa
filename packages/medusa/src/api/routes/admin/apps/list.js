import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  try {
    const oauthService = req.scope.resolve("oauthService")
    const data = await oauthService.list({})

    res.status(200).json({ apps: data })
  } catch (err) {
    throw err
  }
}
