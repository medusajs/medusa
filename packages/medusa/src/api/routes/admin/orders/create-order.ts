import { Type, Transform } from "class-transformer"
import {
  IsEmail,
  IsOptional,
  ValidateNested,
  IsArray,
  IsString,
  IsBoolean,
  IsObject,
  IsInt,
  IsNotEmpty,
} from "class-validator"
import { AddressPayload } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
// * x-authenticated: true

export default async (req, res) => {
  const validated = await validator(AdminPostOrderReq, req.body)

  const orderService = req.scope.resolve("orderService")
  let order = await orderService.create(validated)
  order = await orderService.decorate(order, [], ["region"])

  res.status(200).json({ order })
}

export class AdminPostOrderReq {
  @IsString()
  @IsOptional()
  status?: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressPayload)
  billing_address: AddressPayload

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressPayload)
  shipping_address: AddressPayload

  @IsArray()
  @IsNotEmpty()
  items: object[]

  @IsString()
  @IsNotEmpty()
  region: string

  @IsArray()
  @IsOptional()
  discounts?: object[]

  @IsString()
  @IsNotEmpty()
  customer_id: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method: PaymentMethod

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShippingMethod)
  shipping_method?: ShippingMethod[]

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value && value.toString() === "true")
  no_notification?: boolean
}

class PaymentMethod {
  @IsString()
  @IsNotEmpty()
  provider_id: string

  @IsObject()
  @IsOptional()
  data?: object
}

class ShippingMethod {
  @IsString()
  @IsNotEmpty()
  provider_id: string

  @IsString()
  @IsNotEmpty()
  profile_id: string

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  price: number

  @IsObject()
  @IsOptional()
  data?: object

  @IsArray()
  @IsOptional()
  items?: object[]
}
