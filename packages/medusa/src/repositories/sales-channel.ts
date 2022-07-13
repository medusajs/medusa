import { Brackets, EntityRepository, Repository } from "typeorm"
import { SalesChannel } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common";

@EntityRepository(SalesChannel)
export class SalesChannelRepository extends Repository<SalesChannel> {
  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: ExtendedFindConfig<SalesChannel, Selector<SalesChannel>> = { where: {} },
  ): Promise<[SalesChannel[], number]> {
    const options_ = { ...options }
    delete options_?.where?.name
    delete options_?.where?.description

    let qb = this.createQueryBuilder("sales_channel")
      .select()
      .where(options_.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`sales_channel.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`sales_channel.name ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(options.skip)
      .take(options.take)

    if (options.withDeleted) {
      qb = qb.withDeleted()
    }

    return await qb.getManyAndCount()
  }
}
