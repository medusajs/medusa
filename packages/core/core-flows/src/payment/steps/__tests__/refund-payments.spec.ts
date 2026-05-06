import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import type { IPaymentModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { refundPaymentsStep } from "../refund-payments"

describe("refundPaymentsStep", () => {
  let container!: MedusaContainer

  beforeEach(() => {
    container = createContainer() as unknown as MedusaContainer
  })

  it("returns refunded payments when all refund operations succeed", async () => {
    const refundPayment = jest
      .fn()
      .mockResolvedValueOnce({ id: "pay_1" })
      .mockResolvedValueOnce({ id: "pay_2" })

    container.register(
      Modules.PAYMENT,
      asFunction(() => ({ refundPayment }) as unknown as IPaymentModuleService)
    )

    const workflow = createWorkflow("refund-payments-step-success-test", () => {
      const result = refundPaymentsStep([
        { payment_id: "pay_1", amount: 10 },
        { payment_id: "pay_2", amount: 20 },
      ])

      return new WorkflowResponse(result)
    })

    const { result } = await workflow(container).run()

    expect(result).toEqual([{ id: "pay_1" }, { id: "pay_2" }])
    expect(refundPayment).toHaveBeenCalledTimes(2)
  })

  it("fails the workflow when any refund operation fails", async () => {
    const refundPayment = jest
      .fn()
      .mockResolvedValueOnce({ id: "pay_1" })
      .mockRejectedValueOnce(new Error("provider failed"))

    container.register(
      Modules.PAYMENT,
      asFunction(() => ({ refundPayment }) as unknown as IPaymentModuleService)
    )

    const workflow = createWorkflow("refund-payments-step-failure-test", () => {
      const result = refundPaymentsStep([
        { payment_id: "pay_1", amount: 10 },
        { payment_id: "pay_2", amount: 20 },
      ])

      return new WorkflowResponse(result)
    })

    await expect(workflow(container).run()).rejects.toThrow("provider failed")
    expect(refundPayment).toHaveBeenCalledTimes(2)
  })
})
