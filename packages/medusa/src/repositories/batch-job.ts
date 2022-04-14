import { EntityRepository, Repository } from "typeorm"
import { BatchJob } from "../models"

@EntityRepository(BatchJob)
export class BatchJobRepository extends Repository<BatchJob> {}
