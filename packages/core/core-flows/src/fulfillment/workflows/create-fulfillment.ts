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
import { createFulfillmentStep } from "../steps"
import { useRemoteQueryStep } from "../../common"

export const createFulfillmentWorkflowId = "create-fulfillment-workflow"
/**
 * This workflow creates a fulfillment.
 */
export const createFulfillmentWorkflow = createWorkflow(
  createFulfillmentWorkflowId,
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

    // When we have support for hooks with a return this would be a great
    // place to put a hook for people to collect additional data they would
    // like to pass down to the provider.
    //
    // const providerDataHook = createHook("getProviderData", stepInput)
    //
    // The collected provider data would be passed to createFulfillment in a
    // additional_provider_data: Record<string, unknown> field.

    const result = createFulfillmentStep(stepInput)

    return new WorkflowResponse(result)
  }
)
