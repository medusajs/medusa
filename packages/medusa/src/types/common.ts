import "reflect-metadata"

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: { [K: string]: "ASC" | "DESC" }
}

export type QueryConfig<TEntity> = {
  /**
   * Default fields and relations to return
   */
  defaults?: (keyof TEntity | string)[]
  /**
   * @deprecated Use `defaults` instead
   */
  defaultFields?: (keyof TEntity | string)[]
  /**
   * @deprecated Use `defaultFields` instead and the relations will be inferred
   */
  defaultRelations?: string[]
  /**
   * Fields and relations that are allowed to be requested
   */
  allowed?: string[]
  /**
   * @deprecated Use `allowed` instead
   */
  allowedFields?: string[]
  /**
   * @deprecated Use `allowedFields` instead and the relations will be inferred
   */
  allowedRelations?: string[]
  defaultLimit?: number
  isList?: boolean
}
