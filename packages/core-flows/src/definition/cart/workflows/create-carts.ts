import { CartDTO, CreateCartDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCartsStep } from "../steps"
import { findOneOrAnyRegionStep } from "../steps/find-one-or-any-region"
import { linkCartRegionStep } from "../steps/link-cart-region"

type WorkflowInput = { cartData: CreateCartDTO }

export const createCartWorkflowId = "create-cart"
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO[]> => {
    const region = findOneOrAnyRegionStep({
      regionId: input.cartData.region_id,
    })

    const cart = createCartsStep([input.cartData])

    linkCartRegionStep({ cartId: cart[0].id, regionId: region.id })

    return cart
  }
)
