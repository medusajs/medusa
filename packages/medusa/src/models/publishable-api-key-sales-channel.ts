import { Entity, PrimaryColumn } from "typeorm"

@Entity()
export class PublishableApiKeySalesChannel {
  @PrimaryColumn()
  sales_channel_id: string

  @PrimaryColumn()
  publishable_key_id: string
}
