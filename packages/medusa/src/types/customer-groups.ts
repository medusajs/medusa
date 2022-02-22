import { IsString } from "class-validator"

export type CustomerBatchIds = {
  id: string
}
export class CustomerGroupsBatchCustomer {
  @IsString()
  id: string
}
