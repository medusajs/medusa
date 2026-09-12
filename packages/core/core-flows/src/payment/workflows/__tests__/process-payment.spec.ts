import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import {
  ContainerRegistrationKeys,
  Modules,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { completeCartWorkflowId } from "../../../cart/workflows/complete-cart"
import { processPaymentWorkflow } from "../process-payment"

describe("processPaymentWorkflow", () => {
  const buildContainer = ({
    session = { id: "payses_1", status: PaymentSessionStatus.PENDING },
    payments = [] as any[],
    cartPaymentCollections = [{ cart_id: "cart_1" }] as any[],
    orders = [] as any[],
  } = {}) => {
    const updatePaymentSession = jest.fn().mockResolvedValue(undefined)
    const retrievePaymentSession = jest
      .fn()
      .mockImplementation(async () => ({ ...session }))
    const workflowEngineRun = jest.fn().mockResolvedValue({ result: {} })

    const graph = jest.fn().mockImplementation(async ({ entity }) => {
      switch (entity) {
        case "payment":
          return { data: payments }
        case "payment_session":
          return { data: [{ payment_collection_id: "paycol_1" }] }
        case "cart_payment_collection":
          return { data: cartPaymentCollections }
        case "order_cart":
          return { data: orders }
        default:
          return { data: [] }
      }
    })

    const container = createContainer() as unknown as MedusaContainer

    container.register(
      ContainerRegistrationKeys.QUERY,
      asFunction(() => ({ graph } as any))
    )
    container.register(
      ContainerRegistrationKeys.LOGGER,
      asFunction(
        () => ({ warn: jest.fn(), error: jest.fn(), info: jest.fn() } as any)
      )
    )
    container.register(
      Modules.PAYMENT,
      asFunction(
        () => ({ retrievePaymentSession, updatePaymentSession } as any)
      )
    )
    container.register(
      Modules.WORKFLOW_ENGINE,
      asFunction(() => ({ run: workflowEngineRun } as any))
    )
    container.register(
      Modules.LOCKING,
      asFunction(
        () =>
          ({
            acquire: jest.fn().mockResolvedValue(undefined),
            release: jest.fn().mockResolvedValue(true),
          } as any)
      )
    )

    return { container, updatePaymentSession, workflowEngineRun }
  }

  const completedCart = (workflowEngineRun: jest.Mock) =>
    workflowEngineRun.mock.calls.some(
      (call) => call[0] === completeCartWorkflowId
    )

  it("records a canceled payment on the session without completing the cart", async () => {
    const { container, updatePaymentSession, workflowEngineRun } =
      buildContainer()

    await processPaymentWorkflow(container).run({
      input: {
        action: PaymentActions.CANCELED,
        data: { session_id: "payses_1" },
      } as any,
    })

    expect(updatePaymentSession).toHaveBeenCalledWith({
      id: "payses_1",
      status: PaymentSessionStatus.CANCELED,
    })
    expect(completedCart(workflowEngineRun)).toBe(false)
  })

  it("records a failed payment as an error on the session without completing the cart", async () => {
    const { container, updatePaymentSession, workflowEngineRun } =
      buildContainer()

    await processPaymentWorkflow(container).run({
      input: {
        action: PaymentActions.FAILED,
        data: { session_id: "payses_1" },
      } as any,
    })

    expect(updatePaymentSession).toHaveBeenCalledWith({
      id: "payses_1",
      status: PaymentSessionStatus.ERROR,
    })
    expect(completedCart(workflowEngineRun)).toBe(false)
  })

  it("still completes the cart on an authorized payment", async () => {
    const { container, updatePaymentSession, workflowEngineRun } =
      buildContainer()

    await processPaymentWorkflow(container).run({
      input: {
        action: PaymentActions.AUTHORIZED,
        data: { session_id: "payses_1" },
      } as any,
    })

    expect(completedCart(workflowEngineRun)).toBe(true)
    expect(updatePaymentSession).not.toHaveBeenCalled()
  })

  it("does nothing without a session id", async () => {
    const { container, updatePaymentSession, workflowEngineRun } =
      buildContainer()

    await processPaymentWorkflow(container).run({
      input: { action: PaymentActions.CANCELED, data: {} } as any,
    })

    expect(updatePaymentSession).not.toHaveBeenCalled()
    expect(completedCart(workflowEngineRun)).toBe(false)
  })
})
