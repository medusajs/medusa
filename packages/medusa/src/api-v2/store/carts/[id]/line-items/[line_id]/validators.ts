import { IsInt, IsOptional } from "class-validator"

export class StorePostCartsCartLineItemsItemReq {
  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}
