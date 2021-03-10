import { Validator, MedusaError } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./index"

export default async (req, res) => {
  const schema = Validator.object().keys({
    display_id: Validator.number().required(),
    email: Validator.string().required(),
    shipping_address: Validator.object()
      .keys({
        postal_code: Validator.string(),
      })
      .optional(),
  })

  const { value, error } = schema.validate(req.query)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    const orders = await orderService.list(
      {
        display_id: value.display_id,
        email: value.email,
      },
      {
        select: defaultFields,
        relations: defaultRelations,
      }
    )

    if (orders.length !== 1) {
      res.sendStatus(404)
      return
    }

    const order = orders[0]

    res.json({ order })
  } catch (error) {
    console.log(error)
    throw error
  }
}
