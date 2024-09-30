import {
  FulfillmentDTO,
  FulfillmentWorkflow,
  StockLocationDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createReturnFulfillmentStep } from "../steps"
import { useRemoteQueryStep } from "../../common"

export const createReturnFulfillmentWorkflowId =
  "create-return-fulfillment-workflow"
/**
 * This workflow creates a fulfillment for a return.
 */
export const createReturnFulfillmentWorkflow = createWorkflow(
  createReturnFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateFulfillmentWorkflowInput>
  ): WorkflowResponse<FulfillmentDTO> => {
    const location: StockLocationDTO = useRemoteQueryStep({
      entry_point: "stock_location",
      fields: [
        "id",
        "name",
        "metadata",
        "created_at",
        "updated_at",
        "address.id",
        "address.address_1",
        "address.address_2",
        "address.city",
        "address.country_code",
        "address.phone",
        "address.province",
        "address.postal_code",
        "address.metadata",
      ],
      variables: { id: input.location_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "get-location" })

    const stepInput = transform({ input, location }, ({ input, location }) => {
      return {
        ...input,
        location,
      }
    })

    const result = createReturnFulfillmentStep(stepInput)

    return new WorkflowResponse(result)
  }
)
