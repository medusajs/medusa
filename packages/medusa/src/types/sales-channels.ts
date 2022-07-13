import { IsString } from "class-validator"

export type CreateSalesChannelInput = {
  name: string
  description?: string
  is_disabled?: boolean
}

export type UpdateSalesChannelInput = Partial<CreateSalesChannelInput>

export class ProductBatchSalesChannel {
  @IsString()
  id: string
}
