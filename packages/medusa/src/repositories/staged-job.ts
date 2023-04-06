import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { dataSource } from "../loaders/database"
import { StagedJob } from "../models"

export const StagedJobRepository = dataSource.getRepository(StagedJob).extend({
  async insertBulk(jobToCreates: QueryDeepPartialEntity<StagedJob>[]) {
    const queryBuilder = this.createQueryBuilder()
      .insert()
      .into(StagedJob)
      .values(jobToCreates)

    if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
      const rawStagedJobs = await queryBuilder.execute()
      return rawStagedJobs.generatedMaps.map((d) => this.create(d))
    }

    const rawStagedJobs = await queryBuilder.returning("*").execute()
    return rawStagedJobs.generatedMaps.map((d) => this.create(d))
  },
})

export default StagedJobRepository
