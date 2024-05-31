import { BaseSoftDeletableHttpEntity } from "../base"

export interface AdminShippingProfile extends BaseSoftDeletableHttpEntity {
  name: string
  type: string
}
