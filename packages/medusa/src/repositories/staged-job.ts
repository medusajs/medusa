import { EntityRepository, Repository } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { StagedJob } from "../models"
import { rowSqlResultsToEntityTransformer } from "../utils"

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

    return rowSqlResultsToEntityTransformer(
      rawStagedJobs.raw,
      queryBuilder,
      this.queryRunner!
    )
  }
}
