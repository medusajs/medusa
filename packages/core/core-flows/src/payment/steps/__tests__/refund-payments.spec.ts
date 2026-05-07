import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { PaymentDTO } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { RefundPaymentsStepInput, refundPaymentsStep } from "../refund-payments"

describe("refundPaymentsStep", () => {
  const makeWorkflow = () =>
    createWorkflow("refund-payments-step-test", (input: WorkflowData<any>) => {
      const result = refundPaymentsStep(input as WorkflowData<RefundPaymentsStepInput>)
      return new WorkflowResponse(result)
    })

  it("returns all refunded payments when all refunds succeed", async () => {
    const refundedPayments = [
      { id: "pay_1" },
      { id: "pay_2" },
    ] as PaymentDTO[]

    const refundPaymentMock = jest
      .fn()
      .mockResolvedValueOnce(refundedPayments[0])
      .mockResolvedValueOnce(refundedPayments[1])
    const loggerMock = { error: jest.fn() }

    const container = createContainer() as unknown as MedusaContainer
    container.register(Modules.PAYMENT, asFunction(() => ({ refundPayment: refundPaymentMock } as any)))
    container.register(ContainerRegistrationKeys.LOGGER, asFunction(() => loggerMock as any))

    const workflow = makeWorkflow()

    const { result } = await workflow(container).run({
      input: [
        { payment_id: "pay_1", amount: 100 },
        { payment_id: "pay_2", amount: 250 },
      ],
    })

    expect(result).toEqual({
      refunded_payments: refundedPayments,
      failed_refunds: [],
    })
    expect(refundPaymentMock).toHaveBeenCalledTimes(2)
    expect(loggerMock.error).not.toHaveBeenCalled()
  })

  it("returns refunded and failed refunds when some refunds fail", async () => {
    const refundedPayment = { id: "pay_1" } as PaymentDTO
    const paymentError = new Error("provider timeout")

    const refundPaymentMock = jest.fn().mockImplementation((input) => {
      if (input.payment_id === "pay_1") {
        return Promise.resolve(refundedPayment)
      }

      return Promise.reject(paymentError)
    })
    const loggerMock = { error: jest.fn() }

    const container = createContainer() as unknown as MedusaContainer
    container.register(Modules.PAYMENT, asFunction(() => ({ refundPayment: refundPaymentMock } as any)))
    container.register(ContainerRegistrationKeys.LOGGER, asFunction(() => loggerMock as any))

    const workflow = makeWorkflow()

    const { result } = await workflow(container).run({
      input: [
        { payment_id: "pay_1", amount: 100 },
        { payment_id: "pay_2", amount: 250 },
      ],
    })

    expect(result).toEqual({
      refunded_payments: [refundedPayment],
      failed_refunds: [
        {
          payment_id: "pay_2",
          amount: 250,
          error: "provider timeout",
        },
      ],
    })
    expect(refundPaymentMock).toHaveBeenCalledTimes(2)
    expect(loggerMock.error).toHaveBeenCalledTimes(1)
    expect(loggerMock.error).toHaveBeenCalledWith(
      expect.stringContaining("pay_2")
    )
  })
})
