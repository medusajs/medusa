import { MedusaError } from "medusa-core-utils"
import { EntityManager, FindOperator, In, Raw } from "typeorm"
import { FindConfig, Writable } from "../types/common"

type Selector<TEntity> = { [key in keyof TEntity]?: unknown }

/**
 * Common functionality for Services
 * @interface
 */
export class BaseService<
  TChild extends BaseService<TChild, TContainer>,
  TContainer = unknown
> {
  protected transactionManager_: EntityManager | undefined
  protected manager_: EntityManager
  private readonly container_: TContainer

  constructor(
    container: TContainer,
    protected readonly configModule?: Record<string, unknown>
  ) {
    this.container_ = container
  }

  /**
   * Used to build TypeORM queries.
   * @param selector The selector
   * @param config The config
   * @return The QueryBuilderConfig
   */
  buildQuery_<TEntity = unknown>(
    selector: Selector<TEntity>,
    config: FindConfig<TEntity> = {}
  ): FindConfig<TEntity> & {
    where: Partial<Writable<TEntity>>
    withDeleted?: boolean
  } {
    const build = (
      obj: Record<string, unknown>
    ): Partial<Writable<TEntity>> => {
      return Object.entries(obj).reduce((acc, [key, value]: any) => {
        // Undefined values indicate that they have no significance to the query.
        // If the query is looking for rows where a column is not set it should use null instead of undefined
        if (typeof value === "undefined") {
          return acc
        }

        const subquery: {
          operator: "<" | ">" | "<=" | ">="
          value: unknown
        }[] = []

        switch (true) {
          case value instanceof FindOperator:
            acc[key] = value
            break
          case Array.isArray(value):
            acc[key] = In([...(value as unknown[])])
            break
          case value !== null && typeof value === "object":
            Object.entries(value).map(([modifier, val]) => {
              switch (modifier) {
                case "lt":
                  subquery.push({ operator: "<", value: val })
                  break
                case "gt":
                  subquery.push({ operator: ">", value: val })
                  break
                case "lte":
                  subquery.push({ operator: "<=", value: val })
                  break
                case "gte":
                  subquery.push({ operator: ">=", value: val })
                  break
                default:
                  acc[key] = value
                  break
              }
            })

            if (subquery.length) {
              acc[key] = Raw(
                (a) =>
                  subquery
                    .map((s, index) => `${a} ${s.operator} :${index}`)
                    .join(" AND "),
                subquery.map((s) => s.value)
              )
            }
            break
          default:
            acc[key] = value
            break
        }

        return acc
      }, {} as Partial<Writable<TEntity>>)
    }

    const query: FindConfig<TEntity> & {
      where: Partial<Writable<TEntity>>
      withDeleted?: boolean
    } = {
      where: build(selector),
    }

    if ("deleted_at" in selector) {
      query.withDeleted = true
    }

    if ("skip" in config) {
      query.skip = config.skip
    }

    if ("take" in config) {
      query.take = config.take
    }

    if ("relations" in config) {
      query.relations = config.relations
    }

    if ("select" in config) {
      query.select = config.select
    }

    if ("order" in config) {
      query.order = config.order
    }

    return query
  }

  /**
   * Confirms whether a given raw id is valid. Fails if the provided
   * id is null or undefined. The validate function takes an optional config
   * param, to support checking id prefix and length.
   * @param rawId - the id to validate.
   * @param config - optional config
   * @returns the rawId given that nothing failed
   */
  validateId_(
    rawId: string,
    config: { prefix?: string; length?: number } = {}
  ): string {
    const { prefix, length } = config
    if (!rawId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to validate id: ${rawId}`
      )
    }

    if (prefix || length) {
      const [pre, rand] = rawId.split("_")
      if (prefix && pre !== prefix) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The provided id: ${rawId} does not adhere to prefix constraint: ${prefix}`
        )
      }

      if (length && length !== rand.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The provided id: ${rawId} does not adhere to length constraint: ${length}`
        )
      }
    }

    return rawId
  }

  /**
   * Dedicated method to set metadata.
   * @param obj - the entity to apply metadata to.
   * @param metadata - the metadata to set
   * @return resolves to the updated result.
   */
  setMetadata_(
    obj: { metadata: Record<string, unknown> },
    metadata: Record<string, unknown>
  ): Record<string, unknown> {
    const existing = obj.metadata || {}
    const newData = {}
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof key !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Key type is invalid. Metadata keys must be strings"
        )
      }
      newData[key] = value
    }

    return {
      ...existing,
      ...newData,
    }
  }
}
