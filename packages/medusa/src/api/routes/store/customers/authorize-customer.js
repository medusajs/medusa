import { MedusaError } from "medusa-core-utils"

export default async (req, res, next, id) => {
  if (!(req.user && req.user.customer_id === id)) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must be logged in to update"
    )
  } else {
    next()
  }
}
