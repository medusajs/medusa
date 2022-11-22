import { EntityRepository, In, Repository } from "typeorm"

import { PublishableApiKeySalesChannel, SalesChannel } from "../models"

@EntityRepository(PublishableApiKeySalesChannel)
export class PublishableApiKeySalesChannelRepository extends Repository<PublishableApiKeySalesChannel> {
  /**
   * Query a list of sales channels that are assigned to the publishable key scope
   *
   * @param publishableApiKeyId - id of the key to retrieve channels for
   */
  public async findSalesChannels(
    publishableApiKeyId: string
  ): Promise<SalesChannel[]> {
    const data = await this.createQueryBuilder("PublishableKeySalesChannel")
      .select("PublishableKeySalesChannel.sales_channel_id")
      .innerJoinAndMapOne(
        "PublishableKeySalesChannel.sales_channel_id",
        SalesChannel,
        "SalesChannel",
        "PublishableKeySalesChannel.sales_channel_id = SalesChannel.id"
      )
      .where(
        "PublishableKeySalesChannel.publishable_key_id = :publishableApiKeyId",
        {
          publishableApiKeyId,
        }
      )
      .getMany()

    return data.map(
      (record) => record.sales_channel_id as unknown as SalesChannel
    )
  }

  /**
   * Assign (multiple) sales channels to the Publishable Key scope
   *
   * @param publishableApiKeyId - publishable key id
   * @param salesChannelIds - an array of SC ids
   */
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

  /**
   * Remove multiple sales channels from the PK scope
   *
   * @param publishableApiKeyId -publishable key id
   * @param salesChannelIds - an array of SC ids
   */
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
