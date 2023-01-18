import { Brackets, DeleteResult, FindOptionsWhere, In } from "typeorm"
import { SalesChannel } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"

export const SalesChannelRepository = dataSource
  .getRepository(SalesChannel)
  .extend({
    async getFreeTextSearchResultsAndCount(
      q: string,
      options: ExtendedFindConfig<SalesChannel> = {
        where: {},
      }
    ): Promise<[SalesChannel[], number]> {
      const options_ = { ...options }
      options_.where = options_.where as FindOptionsWhere<SalesChannel>

      delete options_?.where?.name
      delete options_?.where?.description

      let qb = this.createQueryBuilder("sales_channel")
        .select()
        .where(options_.where)
        .andWhere(
          new Brackets((qb) => {
            qb.where(`sales_channel.description ILIKE :q`, {
              q: `%${q}%`,
            }).orWhere(`sales_channel.name ILIKE :q`, { q: `%${q}%` })
          })
        )
        .skip(options.skip)
        .take(options.take)

      if (options.withDeleted) {
        qb = qb.withDeleted()
      }

      return await qb.getManyAndCount()
    },

    async removeProducts(
      salesChannelId: string,
      productIds: string[]
    ): Promise<DeleteResult> {
      return await this.createQueryBuilder()
        .delete()
        .from("product_sales_channel")
        .where({
          sales_channel_id: salesChannelId,
          product_id: In(productIds),
        })
        .execute()
    },

    async addProducts(
      salesChannelId: string,
      productIds: string[]
    ): Promise<void> {
      await this.createQueryBuilder()
        .insert()
        .into("product_sales_channel")
        .values(
          productIds.map((id) => ({
            sales_channel_id: salesChannelId,
            product_id: id,
          }))
        )
        .orIgnore()
        .execute()
    },
  })
export default SalesChannelRepository
