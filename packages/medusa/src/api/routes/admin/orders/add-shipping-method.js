import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    price: Validator.number()
      .integer()
      .integer()
      .allow(0)
      .required(),
    option_id: Validator.string().required(),
    data: Validator.object()
      .optional()
      .default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    await orderService.addShippingMethod(id, value.option_id, value.data, {
      price: value.price,
    })

    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
