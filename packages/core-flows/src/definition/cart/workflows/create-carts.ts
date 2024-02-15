import { CartDTO, CreateCartDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createCartsStep, findOneOrAnyRegionStep } from "../steps"

type WorkflowInput = { cartData: CreateCartDTO }

export const createCartWorkflowId = "create-cart"
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO[]> => {
    const region = findOneOrAnyRegionStep({
      regionId: input.cartData.region_id,
    })

    const cartInput = transform(
      { cartData: input.cartData, region },
      (input) => {
        return {
          ...input.cartData,
          region_id: input.region.id,
        }
      }
    )

    const cart = createCartsStep([cartInput])

    return cart
  }
)
