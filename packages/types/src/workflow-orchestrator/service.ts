import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterableWorkflowExecutionProps,
  UpsertWorkflowExecutionDTO,
  WorkflowExecutionDTO,
} from "./common"

export interface IWorkflowOrchestratorModuleService extends IModuleService {
  createWorkflowExecution(
    data: UpsertWorkflowExecutionDTO[],
    sharedContext?: Context
  ): Promise<WorkflowExecutionDTO[]>

  updateWorkflowExecution(
    data: UpsertWorkflowExecutionDTO[],
    sharedContext?: Context
  ): Promise<WorkflowExecutionDTO[]>

  deleteWorkflowExecution(
    executionIds: string[],
    sharedContext?: Context
  ): Promise<void>

  listWorkflowExecution(
    filters?: FilterableWorkflowExecutionProps,
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<WorkflowExecutionDTO[]>

  listAndCountWorkflowExecution(
    filters?: FilterableWorkflowExecutionProps,
    config?: FindConfig<WorkflowExecutionDTO>,
    sharedContext?: Context
  ): Promise<[WorkflowExecutionDTO[], number]>
}
