import {
  Brackets,
  DeleteResult,
  EntityRepository,
  In,
  Repository,
} from "typeorm"
import { Product, SalesChannel } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common";
import { MedusaError } from "medusa-core-utils";

@EntityRepository(SalesChannel)
export class SalesChannelRepository extends Repository<SalesChannel> {
  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: ExtendedFindConfig<SalesChannel, Selector<SalesChannel>> = {
      where: {},
    }
  ): Promise<[SalesChannel[], number]> {
    const options_ = { ...options }
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
  }

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
  }

  async addProducts(
    salesChannelId: string,
    productIds: string[]
  ): Promise<void> {
    await this.findNonExistingProductAndThrow(productIds)
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
  }

  protected async findNonExistingProductAndThrow(productIds: string[]): Promise<void | never> {
      const existingProducts = await this.manager.createQueryBuilder()
      .select("id")
      .from(Product, "product")
      .where("product.id IN (...ids)", {
        ids: In(productIds)
      })
      .getMany()

    const nonExistingProducts = productIds.filter(
      (cId) => existingProducts.findIndex((el) => el.id === cId) === -1
    )

    if (nonExistingProducts.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The following product ids do not exist: ${JSON.stringify(
          nonExistingProducts.join(", ")
        )}`
      )
    }
  }
}
