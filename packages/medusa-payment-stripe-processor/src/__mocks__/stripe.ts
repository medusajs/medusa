import { PaymentIntentDataByStatus } from "../__fixtures__/data";

function buildPaymentIntent(data) {
  const paymentIntentData = {}

  return Object.assign(paymentIntentData, data)
}

export const StripeMock = {
  retrieve: jest.fn().mockImplementation(async (paymentId) => {
    if (paymentId === PaymentIntentDataByStatus.REQUIRE_PAYMENT_METHOD) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.REQUIRE_PAYMENT_METHOD })
    }
    if (paymentId === PaymentIntentDataByStatus.REQUIRES_CONFIRMATION) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.REQUIRES_CONFIRMATION })
    }
    if (paymentId === PaymentIntentDataByStatus.PROCESSING) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.PROCESSING })
    }
    if (paymentId === PaymentIntentDataByStatus.CANCELED) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.REQUIRES_ACTION })
    }
    if (paymentId === PaymentIntentDataByStatus.CANCELED) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.CANCELED })
    }
    if (paymentId === PaymentIntentDataByStatus.REQUIRES_CAPTURE) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.REQUIRES_CAPTURE })
    }
    if (paymentId === PaymentIntentDataByStatus.SUCCEEDED) {
      return buildPaymentIntent({ status: PaymentIntentDataByStatus.SUCCEEDED })
    }
  })
}

const stripe = jest.fn(() => StripeMock)

export default stripe
