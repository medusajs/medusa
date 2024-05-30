import { BaseSoftDeletableHttpEntity } from "../base"

export interface BaseSalesChannel extends BaseSoftDeletableHttpEntity {
  /**
   * The name of the sales channel.
   */
  name: string
  /**
   * A description of the sales channel.
   */
  description: string | null
  /**
   * Whether the sales channel is disabled.
   */
  is_disabled: boolean
}
