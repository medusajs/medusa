import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules, PaymentSessionStatus } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { updatePaymentSessionStatusStep } from "../update-payment-session-status"

const failingStep = createStep(
  "update-session-status-failing-step",
  async () => {
    throw new Error("a later step failed")
  }
)

describe("updatePaymentSessionStatusStep", () => {
  const buildContainer = (session: Record<string, any>) => {
    const retrievePaymentSession = jest
      .fn()
      .mockImplementation(async () => ({ ...session }))
    const updatePaymentSession = jest.fn().mockResolvedValue(undefined)

    const container = createContainer() as unknown as MedusaContainer
    container.register(
      Modules.PAYMENT,
      asFunction(
        () => ({ retrievePaymentSession, updatePaymentSession } as any)
      )
    )

    return { container, retrievePaymentSession, updatePaymentSession }
  }

  it("records the terminal status on the session", async () => {
    const { container, updatePaymentSession } = buildContainer({
      id: "payses_1",
      status: PaymentSessionStatus.PENDING,
    })

    const workflow = createWorkflow("update-session-status-happy", () => {
      return new WorkflowResponse(
        updatePaymentSessionStatusStep({
          id: "payses_1",
          status: PaymentSessionStatus.CANCELED,
        })
      )
    })

    await workflow(container).run()

    expect(updatePaymentSession).toHaveBeenCalledTimes(1)
    expect(updatePaymentSession).toHaveBeenCalledWith({
      id: "payses_1",
      status: PaymentSessionStatus.CANCELED,
    })
  })

  it("does nothing when the session already carries the status", async () => {
    const { container, updatePaymentSession } = buildContainer({
      id: "payses_1",
      status: PaymentSessionStatus.CANCELED,
    })

    const workflow = createWorkflow("update-session-status-noop", () => {
      return new WorkflowResponse(
        updatePaymentSessionStatusStep({
          id: "payses_1",
          status: PaymentSessionStatus.CANCELED,
        })
      )
    })

    await workflow(container).run()

    expect(updatePaymentSession).not.toHaveBeenCalled()
  })

  it("does nothing without a session id", async () => {
    const { container, retrievePaymentSession, updatePaymentSession } =
      buildContainer({ id: "payses_1", status: PaymentSessionStatus.PENDING })

    const workflow = createWorkflow("update-session-status-no-id", () => {
      return new WorkflowResponse(
        updatePaymentSessionStatusStep({
          id: undefined as any,
          status: PaymentSessionStatus.CANCELED,
        })
      )
    })

    await workflow(container).run()

    expect(retrievePaymentSession).not.toHaveBeenCalled()
    expect(updatePaymentSession).not.toHaveBeenCalled()
  })

  it("restores the previous status when a later step fails", async () => {
    const { container, updatePaymentSession } = buildContainer({
      id: "payses_1",
      status: PaymentSessionStatus.PENDING,
    })

    const workflow = createWorkflow("update-session-status-compensate", () => {
      updatePaymentSessionStatusStep({
        id: "payses_1",
        status: PaymentSessionStatus.CANCELED,
      })
      failingStep()

      return new WorkflowResponse(void 0)
    })

    const { errors } = await workflow(container).run({ throwOnError: false })

    expect(errors.length).toBeGreaterThan(0)
    expect(updatePaymentSession).toHaveBeenCalledTimes(2)
    expect(updatePaymentSession).toHaveBeenLastCalledWith({
      id: "payses_1",
      status: PaymentSessionStatus.PENDING,
    })
  })

  it("has nothing to restore when the status was never changed", async () => {
    const { container, updatePaymentSession } = buildContainer({
      id: "payses_1",
      status: PaymentSessionStatus.CANCELED,
    })

    const workflow = createWorkflow(
      "update-session-status-compensate-noop",
      () => {
        updatePaymentSessionStatusStep({
          id: "payses_1",
          status: PaymentSessionStatus.CANCELED,
        })
        failingStep()

        return new WorkflowResponse(void 0)
      }
    )

    await workflow(container).run({ throwOnError: false })

    expect(updatePaymentSession).not.toHaveBeenCalled()
  })
})
