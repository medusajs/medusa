import { Router } from "express"
import bodyParser from "body-parser"

export default (container) => {
  const route = Router()

  route.post("/discount-code", bodyParser.json(), async (req, res) => {
    // const schema = Validator.object().keys({
    //   discount_code: Validator.string().required(),
    // })

    // const { value, error } = schema.validate(req.body)
    // if (error) {
    //   throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
    // }

    const discountGenerator = req.scope.resolve("discountGeneratorService")
    const code = await discountGenerator.generateDiscount(
      req.body.discount_code
    )

    res.json({
      code,
    })
  })

  return route
}
