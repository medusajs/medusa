import { EntityRepository, Repository } from "typeorm"
import { StagedJob } from "../models/staged-job"

@EntityRepository(StagedJob)
export class StagedJobRepository extends Repository<StagedJob> {}
