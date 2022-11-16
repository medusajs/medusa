import { EntityRepository, In, Repository } from "typeorm"

import { PublishableApiKeySalesChannel } from "../models"

@EntityRepository(PublishableApiKeySalesChannel)
export class PublishableApiKeySalesChannelRepository extends Repository<PublishableApiKeySalesChannel> {
  public async addSalesChannels(
    publishableApiKeyId: string,
    salesChannelIds: string[]
  ): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into("publishable_api_key_sales_channel")
      .values(
        salesChannelIds.map((id) => ({
          sales_channel_id: id,
          publishable_key_id: publishableApiKeyId,
        }))
      )
      .orIgnore()
      .execute()
  }

  public async removeSalesChannels(
    publishableApiKeyId: string,
    salesChannelIds: string[]
  ): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from("publishable_api_key_sales_channel")
      .where({
        sales_channel_id: In(salesChannelIds),
        publishable_key_id: publishableApiKeyId,
      })
      .execute()
  }
}
