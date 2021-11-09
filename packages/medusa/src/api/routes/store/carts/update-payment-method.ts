import { IsOptional, IsString } from "class-validator"
import { defaultFields, defaultRelations } from "."
import { CartService } from "../../../../services"
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    StoreUpdateCartPaymentMethodRequest,
    req.body
  )

  const cartService: CartService = req.scope.resolve("cartService")

  let cart = await cartService.setPaymentMethod(id, validated)
  cart = await cartService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ cart })
}

export class StoreUpdateCartPaymentMethodRequest {
  @IsString()
  provider_id: string
  @IsOptional()
  data: object
}
