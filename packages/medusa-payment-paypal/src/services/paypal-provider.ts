import { EOL } from "os"
import {
  AbstractPaymentProcessor,
  isPaymentProcessorError,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/medusa"
import {
  PaypalOptions,
  PaypalOrder,
  PaypalOrderStatus,
  PurchaseUnits,
} from "../types"
import { humanizeAmount } from "medusa-core-utils"
import { roundToTwo } from "./utils/utils"
import { CreateOrder, PaypalSdk } from "../core"
import { Logger } from "@medusajs/types"

class PayPalProviderService extends AbstractPaymentProcessor {
  static identifier = "paypal"

  protected readonly options_: PaypalOptions
  protected paypal_: PaypalSdk
  protected readonly logger_: Logger | undefined

  constructor({ logger }: { logger?: Logger }, options) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.logger_ = logger
    this.options_ = options
    this.init()
  }

  protected init(): void {
    this.paypal_ = new PaypalSdk({
      ...this.options_,
      logger: this.logger_,
    })
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const order = (await this.retrievePayment(
      paymentSessionData
    )) as PaypalOrder

    switch (order.status) {
      case PaypalOrderStatus.CREATED:
        return PaymentSessionStatus.PENDING
      case PaypalOrderStatus.SAVED:
      case PaypalOrderStatus.APPROVED:
      case PaypalOrderStatus.PAYER_ACTION_REQUIRED:
        return PaymentSessionStatus.REQUIRES_MORE
      case PaypalOrderStatus.VOIDED:
        return PaymentSessionStatus.CANCELED
      case PaypalOrderStatus.COMPLETED:
        return PaymentSessionStatus.AUTHORIZED
      default:
        return PaymentSessionStatus.PENDING
    }
  }

  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const { currency_code, amount, resource_id } = context

    let session_data

    try {
      const intent: CreateOrder["intent"] = this.options_.capture
        ? "CAPTURE"
        : "AUTHORIZE"

      session_data = await this.paypal_.createOrder({
        intent,
        purchase_units: [
          {
            custom_id: resource_id,
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: roundToTwo(
                humanizeAmount(amount, currency_code),
                currency_code
              ),
            },
          },
        ],
      })
    } catch (e) {
      return this.buildError("An error occurred in initiatePayment", e)
    }

    return {
      session_data,
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus
        data: PaymentProcessorSessionResponse["session_data"]
      }
  > {
    try {
      const stat = await this.getPaymentStatus(paymentSessionData)
      const order = (await this.retrievePayment(
        paymentSessionData
      )) as PaypalOrder
      return { data: order, status: stat }
    } catch (error) {
      return this.buildError("An error occurred in authorizePayment", error)
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const order = (await this.retrievePayment(
      paymentSessionData
    )) as PaypalOrder

    const isAlreadyCanceled = order.status === PaypalOrderStatus.VOIDED
    const isCanceledAndFullyRefund =
      order.status === PaypalOrderStatus.COMPLETED && !!order.invoice_id

    if (isAlreadyCanceled || isCanceledAndFullyRefund) {
      return order
    }

    try {
      const { purchase_units } = paymentSessionData as {
        purchase_units: PurchaseUnits
      }
      const isAlreadyCaptured = purchase_units.some(
        (pu) => pu.payments.captures?.length
      )

      if (isAlreadyCaptured) {
        const payments = purchase_units[0].payments

        const payId = payments.captures[0].id
        await this.paypal_.refundPayment(payId)
      } else {
        const id = purchase_units[0].payments.authorizations[0].id
        await this.paypal_.cancelAuthorizedPayment(id)
      }

      return (await this.retrievePayment(
        paymentSessionData
      )) as unknown as PaymentProcessorSessionResponse["session_data"]
    } catch (error) {
      return this.buildError("An error occurred in cancelPayment", error)
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const { purchase_units } = paymentSessionData as {
      purchase_units: PurchaseUnits
    }

    const id = purchase_units[0].payments.authorizations[0].id

    try {
      await this.paypal_.captureAuthorizedPayment(id)
      return await this.retrievePayment(paymentSessionData)
    } catch (error) {
      return this.buildError("An error occurred in capturePayment", error)
    }
  }

  /**
   * Paypal does not provide such feature
   * @param paymentSessionData
   */
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return paymentSessionData
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const { purchase_units } = paymentSessionData as {
      purchase_units: PurchaseUnits
    }

    try {
      const purchaseUnit = purchase_units[0]
      const payments = purchaseUnit.payments
      const isAlreadyCaptured = purchase_units.some(
        (pu) => pu.payments.captures?.length
      )

      if (!isAlreadyCaptured) {
        throw new Error("Cannot refund an uncaptured payment")
      }

      const paymentId = payments.captures[0].id
      const currencyCode = purchaseUnit.amount.currency_code
      await this.paypal_.refundPayment(paymentId, {
        amount: {
          currency_code: currencyCode,
          value: roundToTwo(
            humanizeAmount(refundAmount, currencyCode),
            currencyCode
          ),
        },
      })

      return await this.retrievePayment(paymentSessionData)
    } catch (error) {
      return this.buildError("An error occurred in refundPayment", error)
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      const id = paymentSessionData.id as string
      return (await this.paypal_.getOrder(
        id
      )) as unknown as PaymentProcessorSessionResponse["session_data"]
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e)
    }
  }

  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
    try {
      const { currency_code, amount } = context
      const id = context.paymentSessionData.id as string

      await this.paypal_.patchOrder(id, [
        {
          op: "replace",
          path: "/purchase_units/@reference_id=='default'",
          value: {
            amount: {
              currency_code: currency_code.toUpperCase(),
              value: roundToTwo(
                humanizeAmount(amount, currency_code),
                currency_code
              ),
            },
          },
        },
      ])
      return { session_data: context.paymentSessionData }
    } catch (error) {
      return await this.initiatePayment(context).catch((e) => {
        return this.buildError("An error occurred in updatePayment", e)
      })
    }
  }

  async retrieveOrderFromAuth(authorization) {
    const link = authorization.links.find((l) => l.rel === "up")
    const parts = link.href.split("/")
    const orderId = parts[parts.length - 1]

    if (!orderId) {
      return null
    }

    return await this.paypal_.getOrder(orderId)
  }

  async retrieveAuthorization(id) {
    return await this.paypal_.getAuthorizationPayment(id)
  }

  protected buildError(
    message: string,
    e: PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : e.message ?? "",
    }
  }

  /**
   * Checks if a webhook is verified.
   * @param {object} data - the verficiation data.
   * @returns {Promise<object>} the response of the verification request.
   */
  async verifyWebhook(data) {
    return await this.paypal_.verifyWebhook({
      webhook_id: this.options_.auth_webhook_id || this.options_.authWebhookId,
      ...data,
    })
  }
}

export default PayPalProviderService
