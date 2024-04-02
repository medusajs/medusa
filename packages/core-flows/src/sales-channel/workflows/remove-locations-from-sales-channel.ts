import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { DeleteEntityInput, Modules, RemoteLink } from "@medusajs/modules-sdk"
import {
  StepResponse,
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"

import { SalesChannelDTO } from "@medusajs/types"
import { removeLocationsFromSalesChannelStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"

interface WorkflowInput {
  data: {
    sales_channel_id: string
    location_ids: string[]
  }[]
}

export const removeLocationsToSalesChannelWorkflowId =
  "remove-locations-to-sales-channel"
export const removeLocationsToSalesChannelWorkflow = createWorkflow(
  removeLocationsToSalesChannelWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    removeLocationsFromSalesChannelStep(input.data)
  }
)
