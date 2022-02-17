import { IsString } from "class-validator"

export class CustomerGroupsBatchCustomer {
  @IsString()
  id: string
}
