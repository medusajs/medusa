import { PaymentIntentDataByStatus } from "../../__fixtures__/data"

export const SUCCESS_INTENT = "right@test.fr"
export const FAIL_INTENT_ID = "unknown"
export const INVOICE_ID = "invoice_id"

export const PayPalMock = {
  cancelAuthorizedPayment: jest.fn().mockImplementation(() => {
    return {
      status: "VOIDED"
    }
  }),
  captureAuthorizedPayment: jest.fn().mockImplementation((id) => {
    if (id === FAIL_INTENT_ID) {
      throw new Error("Error.")
    }

    return {
      id: "test",
      capture: true,
    }
  }),
  refundPayment: jest.fn().mockImplementation((paymentId) => {
    if (paymentId === FAIL_INTENT_ID) {
      throw new Error("Error")
    }

    return undefined
/*
    return {
      result: {
        id: "test",
      },
      status: "COMPLETED",
      invoice_id: INVOICE_ID,
      body: null,
      requestBody: function (d) {
        this.body = d
      },
    }*/
  }),
  createOrder: jest.fn().mockImplementation((d) => {
    if (d.purchase_units[0].custom_id === FAIL_INTENT_ID) {
      throw new Error("Error.")
    }

    return d
   /* return {
      result: {
        id: "test",
      },
      order: true,
      body: null,
      requestBody: function (d) {
        if (d.purchase_units[0].custom_id === FAIL_INTENT_ID) {
          throw new Error("Error.")
        }

        this.body = d
      }
    }*/
  }),
  patchOrder: jest.fn().mockImplementation((id) => {
    if (id === FAIL_INTENT_ID) {
      throw new Error("Error.")
    }

    return {
      id: "test",
      order: true,
      body: null,
      requestBody: function (d) {
        this.body = d
      },
    }
  }),
  getOrder: jest.fn().mockImplementation((paymentId) => {
    if (paymentId === FAIL_INTENT_ID) {
      throw new Error("Error")
    }

    return Object.values(PaymentIntentDataByStatus).find(value => {
        return value.id === paymentId
      }) ?? {}
  }),
}

export default PayPalMock
