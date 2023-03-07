import { EntityRepository, Repository } from "typeorm"
import { StagedJob } from "../models"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { RelationIdLoader } from "typeorm/query-builder/RelationIdLoader"
import { RawSqlResultsToEntityTransformer } from "typeorm/query-builder/transformer/RawSqlResultsToEntityTransformer"

@EntityRepository(StagedJob)
export class StagedJobRepository extends Repository<StagedJob> {
  async insertBulk(jobToCreates: QueryDeepPartialEntity<StagedJob>[]) {
    const queryBuilder = this.createQueryBuilder()
    const rawStagedJobs = await queryBuilder
      .insert()
      .into(StagedJob)
      .values(jobToCreates)
      .returning("*")
      .execute()

    const relationIdLoader = new RelationIdLoader(
      queryBuilder.connection,
      this.queryRunner,
      queryBuilder.expressionMap.relationIdAttributes
    )
    const rawRelationIdResults = await relationIdLoader.load(rawStagedJobs.raw)
    const transformer = new RawSqlResultsToEntityTransformer(
      queryBuilder.expressionMap,
      queryBuilder.connection.driver,
      rawRelationIdResults,
      [],
      this.queryRunner
    )

    return transformer.transform(
      rawStagedJobs.raw,
      queryBuilder.expressionMap.mainAlias!
    ) as StagedJob[]
  }
}
