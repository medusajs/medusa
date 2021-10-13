import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  try {
    const userService = req.scope.resolve("userService")
    let users = await userService.list()

    res.status(200).json({ users })
  } catch (err) {
    throw err
  }
}
