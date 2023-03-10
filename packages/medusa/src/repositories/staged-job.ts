import { EntityRepository, Repository } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { StagedJob } from "../models"

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

    return rawStagedJobs.generatedMaps as StagedJob[]
  }
}
