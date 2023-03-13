import { RelationIdLoader } from "typeorm/query-builder/relation-id/RelationIdLoader"
import { RawSqlResultsToEntityTransformer } from "typeorm/query-builder/transformer/RawSqlResultsToEntityTransformer"
import { QueryBuilder, QueryRunner } from "typeorm"

export async function rowSqlResultsToEntityTransformer<T>(
  rows: any[],
  queryBuilder: QueryBuilder<T>,
  queryRunner: QueryRunner
): Promise<T[]> {
  const relationIdLoader = new RelationIdLoader(
    queryBuilder.connection,
    queryRunner,
    queryBuilder.expressionMap.relationIdAttributes
  )
  const transformer = new RawSqlResultsToEntityTransformer(
    queryBuilder.expressionMap,
    queryBuilder.connection.driver,
    [],
    [],
    queryRunner
  )

  return transformer.transform(
    rows,
    queryBuilder.expressionMap.mainAlias!
  ) as T[]
}
