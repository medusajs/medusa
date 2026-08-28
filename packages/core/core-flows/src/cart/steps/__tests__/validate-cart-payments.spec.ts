import { MedusaContainer } from "@medusajs/framework"
import { createContainer } from "@medusajs/framework/awilix"
import { PaymentSessionStatus } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { validateCartPaymentsStep } from "../validate-cart-payments"

const UNDERPAID_MESSAGE =
  "The payment sessions of the cart do not cover its total. Refresh the cart's payment collection and try again."

const buildCart = (data: {
  total: number
  sessions: { amount: number; status?: PaymentSessionStatus }[]
}) =>
  ({
    id: "cart_123",
    total: data.total,
    raw_total: { value: `${data.total}`, precision: 20 },
    credit_line_total: 0,
    payment_collection: {
      id: "paycol_123",
      payment_sessions: data.sessions.map((session, index) => ({
        id: `payses_${index}`,
        amount: session.amount,
        raw_amount: { value: `${session.amount}`, precision: 20 },
        status: session.status ?? PaymentSessionStatus.PENDING,
      })),
    },
  } as any)

let counter = 0
const runStep = async (cart: any) => {
  const workflow = createWorkflow(
    `validate-cart-payments-test-${counter++}`,
    () => {
      return new WorkflowResponse(validateCartPaymentsStep({ cart }))
    }
  )

  const container = createContainer() as unknown as MedusaContainer
  const { result } = await workflow(container).run({ input: {} })
  return result
}

describe("validateCartPaymentsStep", () => {
  it("should return the processable payment sessions when they cover the total", async () => {
    const result = await runStep(
      buildCart({ total: 2400, sessions: [{ amount: 2400 }] })
    )

    expect(result).toHaveLength(1)
  })

  it("should sum the processable payment sessions before comparing to the total", async () => {
    const result = await runStep(
      buildCart({ total: 2400, sessions: [{ amount: 2000 }, { amount: 400 }] })
    )

    expect(result).toHaveLength(2)
  })

  it("should allow payment sessions that exceed the total", async () => {
    const result = await runStep(
      buildCart({ total: 2000, sessions: [{ amount: 2400 }] })
    )

    expect(result).toHaveLength(1)
  })

  // Taxes added after the payment session was created used to let the customer
  // complete the cart underpaid.
  it("should throw when the payment sessions do not cover the total", async () => {
    const error = await runStep(
      buildCart({ total: 2400, sessions: [{ amount: 2000 }] })
    ).catch((e) => e)

    expect(error.message).toEqual(UNDERPAID_MESSAGE)
  })

  it("should ignore non-processable payment sessions when summing the amounts", async () => {
    const error = await runStep(
      buildCart({
        total: 2400,
        sessions: [
          { amount: 2000 },
          { amount: 400, status: PaymentSessionStatus.CANCELED },
        ],
      })
    ).catch((e) => e)

    expect(error.message).toEqual(UNDERPAID_MESSAGE)
  })
})
