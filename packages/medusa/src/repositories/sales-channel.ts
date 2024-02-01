import { DeleteResult, FindOptionsWhere, ILike, In } from "typeorm"
import { SalesChannel } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { generateEntityId } from "../utils"
import { ProductSalesChannel } from "../models/product-sales-channel"

const productSalesChannelTable = "product_sales_channel"

export const SalesChannelRepository = dataSource
  .getRepository(SalesChannel)
  .extend({
    async getFreeTextSearchResults_(
      q: string,
      options: ExtendedFindConfig<SalesChannel> & { withCount?: boolean } = {
        where: {},
      }
    ): Promise<SalesChannel[] | [SalesChannel[], number]> {
      const options_ = { ...options }

      options_.where = options_.where as FindOptionsWhere<SalesChannel>
      delete options_?.where?.name
      delete options_?.where?.description

      options_.where = [
        {
          ...options_.where,
          name: ILike(`%${q}%`),
        },
        {
          ...options_.where,
          description: ILike(`%${q}%`),
        },
      ]

      let qb = this.createQueryBuilder()
        .select()
        .where(options_.where)
        .skip(options_.skip)
        .take(options_.take)

      if (options_.withDeleted) {
        qb = qb.withDeleted()
      }

      return await (options_.withCount ? qb.getManyAndCount() : qb.getMany())
    },

    async getFreeTextSearchResultsAndCount(
      q: string,
      options: ExtendedFindConfig<SalesChannel> = {
        where: {},
      }
    ): Promise<[SalesChannel[], number]> {
      return (await this.getFreeTextSearchResults_(q, {
        ...options,
        withCount: true,
      })) as [SalesChannel[], number]
    },

    async getFreeTextSearchResults(
      q: string,
      options: ExtendedFindConfig<SalesChannel> = {
        where: {},
      }
    ): Promise<SalesChannel[]> {
      return (await this.getFreeTextSearchResults_(
        q,
        options
      )) as SalesChannel[]
    },

    async removeProducts(
      salesChannelId: string,
      productIds: string[]
    ): Promise<DeleteResult> {
      const whereOptions = {
        sales_channel_id: salesChannelId,
        product_id: In(productIds),
      }

      return await this.createQueryBuilder()
        .delete()
        .from(productSalesChannelTable)
        .where(whereOptions)
        .execute()
    },

    async addProducts(
      salesChannelId: string,
      productIds: string[],
      isMedusaV2Enabled?: boolean
    ): Promise<void> {
      let valuesToInsert = productIds.map((id) => ({
        sales_channel_id: salesChannelId,
        product_id: id,
      }))

      if (isMedusaV2Enabled) {
        valuesToInsert = valuesToInsert.map((v) => ({
          ...v,
          id: generateEntityId(undefined, "prodsc"),
        }))
      }

      await this.createQueryBuilder()
        .insert()
        .into(
          isMedusaV2Enabled ? ProductSalesChannel : productSalesChannelTable
        )
        .values(valuesToInsert)
        .orIgnore()
        .execute()
    },

    async listProductIdsBySalesChannelIds(
      salesChannelIds: string | string[]
    ): Promise<{ [salesChannelId: string]: string[] }> {
      salesChannelIds = Array.isArray(salesChannelIds)
        ? salesChannelIds
        : [salesChannelIds]

      const result = await this.createQueryBuilder()
        .select(["sales_channel_id", "product_id"])
        .from(productSalesChannelTable, "psc")
        .where({ sales_channel_id: In(salesChannelIds) })
        .execute()

      return result.reduce((acc, curr) => {
        acc[curr.sales_channel_id] ??= []
        acc[curr.sales_channel_id].push(curr.product_id)

        return acc
      }, {})
    },
  })

export default SalesChannelRepository
