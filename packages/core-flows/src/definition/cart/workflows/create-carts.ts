import { CartDTO, CreateCartDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCartsStep, findOneOrAnyRegionStep } from "../steps"

type WorkflowInput = { cartData: CreateCartDTO }

export const createCartWorkflowId = "create-cart"
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO[]> => {
    const region = findOneOrAnyRegionStep({
      regionId: input.cartData.region_id,
    })

    const cart = createCartsStep([{ ...input.cartData, region_id: region.id }])

    return cart
  }
)
