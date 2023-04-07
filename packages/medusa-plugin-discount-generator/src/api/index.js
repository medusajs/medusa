import bodyParser from "body-parser"
import { Router } from "express"

export default (container) => {
  const route = Router()

  route.post("/discount-code", bodyParser.json(), async (req, res) => {
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
