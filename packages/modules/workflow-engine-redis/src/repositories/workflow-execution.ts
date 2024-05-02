import { DALUtils } from "@medusajs/utils"
import { WorkflowExecution } from "@models"

// eslint-disable-next-line max-len
export class WorkflowExecutionRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  WorkflowExecution
) {}
