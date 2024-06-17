import { CustomerDTO } from "../customer"
import { RegionDTO } from "../region"
import { OrderDTO } from "./common"

export interface OrderWorkflowDTO extends OrderDTO {
  customer?: CustomerDTO
  region?: RegionDTO
}
