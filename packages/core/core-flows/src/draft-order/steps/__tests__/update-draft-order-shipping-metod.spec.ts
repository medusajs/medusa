import type { IOrderModuleService } from "@medusajs/framework/types"
import { asValue } from "@medusajs/framework/awilix"
import {
  createMedusaContainer,
  Modules,
  TransactionHandlerType,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setTimeout } from "timers/promises"
import {
  updateDraftOrderShippingMethodStep,
  updateDraftOrderShippingMethodStepId,
} from "../update-draft-order-shipping-metod"

const shippingMethod = {
  id: "sm_123",
  shipping_option_id: "so_old",
  amount: 10,
}

const stepInput = {
  order_id: "order_123",
  shipping_method_id: shippingMethod.id,
  shipping_option_id: "so_new",
  amount: 20,
}

describe("updateDraftOrderShippingMethodStep", () => {
  let settledUpdates: number
  let orderService: {
    listOrderShippingMethods: jest.Mock
    updateOrderShippingMethods: jest.Mock
  }

  const buildContainer = () => {
    const container = createMedusaContainer()
    container.register(
      Modules.ORDER,
      asValue(orderService as unknown as IOrderModuleService)
    )

    return container
  }

  beforeEach(() => {
    settledUpdates = 0
    orderService = {
      listOrderShippingMethods: jest.fn(async () => [shippingMethod]),
      // Settles on a later macrotask so that a dropped promise is observable:
      // the run would resolve before this ever finishes.
      updateOrderShippingMethods: jest.fn(async (data: any[]) => {
        await setTimeout(10)
        settledUpdates++

        return [{ ...shippingMethod, ...data[0] }]
      }),
    }
  })

  it("should wait for the rollback update to complete when compensating", async () => {
    const failingStep = createStep("fail-after-shipping-method-update", () => {
      throw new Error("An error occurred after the shipping method update.")
    })

    const workflow = createWorkflow(
      "update-draft-order-shipping-method-awaits-rollback",
      () => {
        updateDraftOrderShippingMethodStep(stepInput)
        failingStep()

        return new WorkflowResponse(void 0)
      }
    )

    const { errors } = await workflow(buildContainer()).run({
      throwOnError: false,
    })

    expect(errors).toHaveLength(1)

    // The forward update and the rollback update must both have settled by the
    // time the run resolves. Without awaiting the rollback, only the forward
    // update would have completed here.
    expect(orderService.updateOrderShippingMethods).toHaveBeenCalledTimes(2)
    expect(settledUpdates).toBe(2)

    // The rollback restores the values captured before the update.
    expect(orderService.updateOrderShippingMethods).toHaveBeenNthCalledWith(2, [
      shippingMethod,
    ])
  })

  it("should report a failing rollback instead of dropping the rejection", async () => {
    orderService.updateOrderShippingMethods = jest.fn(async (data: any[]) => {
      await setTimeout(10)
      settledUpdates++

      if (settledUpdates > 1) {
        throw new Error("Could not restore the shipping method.")
      }

      return [{ ...shippingMethod, ...data[0] }]
    })

    const failingStep = createStep(
      "fail-after-shipping-method-update-rollback",
      () => {
        throw new Error("An error occurred after the shipping method update.")
      }
    )

    const workflow = createWorkflow(
      "update-draft-order-shipping-method-reports-failing-rollback",
      () => {
        updateDraftOrderShippingMethodStep(stepInput)
        failingStep()

        return new WorkflowResponse(void 0)
      }
    )

    const { transaction } = await workflow(buildContainer()).run({
      throwOnError: false,
    })

    // The rejection is handed to the orchestrator rather than escaping as an
    // unhandled rejection, so the failed rollback is recorded on the transaction.
    expect(transaction.getErrors(TransactionHandlerType.COMPENSATE)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: updateDraftOrderShippingMethodStepId,
          handlerType: TransactionHandlerType.COMPENSATE,
          error: expect.objectContaining({
            message: "Could not restore the shipping method.",
          }),
        }),
      ])
    )
  })

  it("should skip the rollback when the step did not run", async () => {
    const failingStep = createStep("fail-before-shipping-method-update", () => {
      throw new Error("An error occurred before the shipping method update.")
    })

    const workflow = createWorkflow(
      "update-draft-order-shipping-method-skips-rollback",
      () => {
        failingStep()
        updateDraftOrderShippingMethodStep(stepInput)

        return new WorkflowResponse(void 0)
      }
    )

    await workflow(buildContainer()).run({ throwOnError: false })

    expect(orderService.updateOrderShippingMethods).not.toHaveBeenCalled()
  })
})
