import { Router } from "express"
import bodyParser from "body-parser"
import { MedusaError } from "medusa-core-utils"
import { isObject, isString } from "@medusa/utils"

export default (container) => {
  const route = Router()

  route.post("/discount-code", bodyParser.json(), async (req, res) => {
    const requestIsValid =
      isObject(req.body) && isString(req.body.discount_code)

    if (!requestIsValid) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
    }

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
