import { Brackets, In } from "typeorm"

import { PublishableApiKeySalesChannel, SalesChannel } from "../models"
import { dataSource } from "../loaders/database"
import SalesChannelRepository from "./sales-channel"
import { generateEntityId } from "../utils"

const publishableApiKeySalesChannelAlias = "PublishableKeySalesChannel"

export const PublishableApiKeySalesChannelRepository = dataSource
  .getRepository(PublishableApiKeySalesChannel)
  .extend({
    /**
     * Query a list of sales channels that are assigned to the publishable key scope
     *
     * @param publishableApiKeyId - id of the key to retrieve channels for
     * @param config - querying params
     */
    async findSalesChannels(
      publishableApiKeyId: string,
      config?: { q?: string }
    ): Promise<SalesChannel[]> {
      const salesChannelAlias = "sales_channel"

      const queryBuilder = this.createQueryBuilder(
        publishableApiKeySalesChannelAlias
      )
        .select(`${salesChannelAlias}.*`)
        .from(SalesChannel, salesChannelAlias)
        .where(
          `${publishableApiKeySalesChannelAlias}.publishable_key_id = :publishableApiKeyId`,
          {
            publishableApiKeyId,
          }
        )
        .andWhere(
          `${publishableApiKeySalesChannelAlias}.sales_channel_id = ${salesChannelAlias}.id`
        )

      if (config?.q) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where(`${salesChannelAlias}.description ILIKE :q`, {
              q: `%${config.q}%`,
            }).orWhere(`${salesChannelAlias}.name ILIKE :q`, {
              q: `%${config.q}%`,
            })
          })
        )
      }

      const records = await queryBuilder.getRawMany()
      return records.map((salesChannel: SalesChannel) =>
        SalesChannelRepository.create(salesChannel)
      )
    },

    /**
     * Assign (multiple) sales channels to the Publishable Key scope
     *
     * @param publishableApiKeyId - publishable key id
     * @param salesChannelIds - an array of SC ids
     */
    async addSalesChannels(
      publishableApiKeyId: string,
      salesChannelIds: string[]
    ): Promise<void> {
      const valuesToInsert = salesChannelIds.map((id) => ({
        id: generateEntityId(undefined, "pksc"),
        sales_channel_id: id,
        publishable_key_id: publishableApiKeyId,
      }))

      await this.createQueryBuilder()
        .insert()
        .into(PublishableApiKeySalesChannel)
        .values(valuesToInsert)
        .orIgnore()
        .execute()
    },

    /**
     * Remove multiple sales channels from the PK scope
     *
     * @param publishableApiKeyId -publishable key id
     * @param salesChannelIds - an array of SC ids
     */
    async removeSalesChannels(
      publishableApiKeyId: string,
      salesChannelIds: string[]
    ): Promise<void> {
      await this.createQueryBuilder()
        .delete()
        .from(PublishableApiKeySalesChannel)
        .where({
          sales_channel_id: In(salesChannelIds),
          publishable_key_id: publishableApiKeyId,
        })
        .execute()
    },
  })
export default PublishableApiKeySalesChannelRepository
