import { FindConfig } from "../../types/common"
import { Customer } from "../../models/customer"

export interface CustomerRetrieveByEmail {
  retrieveByEmail(
    email: string,
    config?: FindConfig<Customer>
  ): Promise<Customer>
}
