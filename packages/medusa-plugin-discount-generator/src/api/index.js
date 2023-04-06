import { Router } from "express"
import bodyParser from "body-parser"
import { IsString } from "class-validator"
import { validator } from "@medusajs/utils"

export default (container) => {
  const route = Router()

  route.post("/discount-code", bodyParser.json(), async (req, res) => {
    const validated = await validator(CreateDiscountCodeReq, req.body)

    const discountGenerator = req.scope.resolve("discountGeneratorService")
    const code = await discountGenerator.generateDiscount(
      validated.discount_code
    )

    res.json({
      code,
    })
  })

  return route
}

class CreateDiscountCodeReq {
  @IsString
  discount_code
}
