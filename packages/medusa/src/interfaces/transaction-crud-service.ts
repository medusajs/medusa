import { Repository } from "typeorm"
import { TransactionBaseService } from "./transaction-base-service"
import {
  FindConfig,
  FindWithoutRelationsOptions,
  QuerySelector,
  Selector,
} from "../types/common"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"
import { ObjectType } from "typeorm/common/ObjectType"
import Logger from "../loaders/logger"

type GetFreeTextSearchResultsAndCount<TEntity> = (
  q: string,
  options?: FindWithoutRelationsOptions<TEntity>,
  relations?: string[]
) => Promise<[TEntity[], number]>

export abstract class TransactionCrudService<
  TChild extends TransactionBaseService<TChild, TContainer>,
  TEntity,
  TContainer = unknown
> extends TransactionBaseService<TChild> {
  protected constructor(
    protected readonly __repo__: ObjectType<Repository<TEntity>>,
    protected readonly __entityName__: string,
    container: unknown,
    config?: Record<string, unknown>
  ) {
    super(container, config)
  }

  public async retrieve(
    id: string,
    config: FindConfig<TEntity>,
    options: {
      customBuildQuery?: (config: FindConfig<TEntity>) => {
        select?: (keyof TEntity)[]
        relations?: string[]
      }
    } & Record<string, unknown> = {}
  ): Promise<TEntity> {
    const repo = this.manager_.getCustomRepository(this.__repo__)

    let select
    let relations
    if (options.customBuildQuery) {
      const subQuery = options.customBuildQuery(config)
      select = subQuery.select
      relations = subQuery.relations
    }

    const query = buildQuery({ id }, config)

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    } else {
      query.select = undefined
    }

    const entity = await repo.findOne(query)

    if (!entity) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `${this.__entityName__} with ${id} was not found`
      )
    }

    return entity
  }

  public async listAndCount(
    selector: Selector<TEntity> | QuerySelector<TEntity>,
    config: FindConfig<TEntity>
  ): Promise<[TEntity[], number]> {
    const repo = this.manager_.getCustomRepository(
      this.__repo__
    ) as Repository<TEntity> & {
      getFreeTextSearchResultsAndCount?: GetFreeTextSearchResultsAndCount<TEntity>
    }

    let q: string | undefined
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      if (repo.getFreeTextSearchResultsAndCount) {
        const { relations, ...query_ } = query
        return await repo.getFreeTextSearchResultsAndCount(
          q,
          query_ as FindWithoutRelationsOptions<TEntity>,
          relations
        )
      } else {
        Logger.warn(
          `getFreeTextSearchResultsAndCount is not implemented in the ${repo.constructor.name}. Fallback to a classical search without text.`
        )
      }
    }

    return await repo.findAndCount(query)
  }

  public async list(
    selector: Selector<TEntity> | QuerySelector<TEntity>,
    config: FindConfig<TEntity>
  ): Promise<TEntity[]> {
    const [entities] = await this.listAndCount(selector, config)
    return entities
  }
}
