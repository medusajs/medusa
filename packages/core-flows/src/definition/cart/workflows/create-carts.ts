import { CartDTO, CreateCartWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createCartsStep, findOneOrAnyRegionStep } from "../steps"

export const createCartWorkflowId = "create-cart"
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (
    input: WorkflowData<CreateCartWorkflowInputDTO>
  ): WorkflowData<CartDTO[]> => {
    const region = findOneOrAnyRegionStep({
      regionId: input.region_id,
    })

    const cartInput = transform({ input, region }, (data) => {
      return {
        ...data.input,
        currency_code: data?.input.currency_code || data.region.currency_code,
        region_id: data.region.id,
      }
    })

    const cart = createCartsStep([cartInput])

    return cart
  }
)
