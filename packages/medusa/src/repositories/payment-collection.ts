import { MedusaError } from "medusa-core-utils"
import { PaymentCollection } from "./../models/payment-collection"
import { FindConfig } from "../types/common"
import { dataSource } from "../loaders/database"

export const PaymentCollectionRepository = dataSource
  .getRepository(PaymentCollection)
  .extend({
    async getPaymentCollectionIdBySessionId(
      sessionId: string,
      config: FindConfig<PaymentCollection> = {}
    ): Promise<PaymentCollection> {
      const paymentCollection = await this.find({
        join: {
          alias: "payment_col",
          innerJoin: { payment_sessions: "payment_col.payment_sessions" },
        },
        where: {
          payment_sessions: {
            id: sessionId,
          },
        },
        relations: config.relations,
        select: config.select,
      })

      if (!paymentCollection.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Payment collection related to Payment Session id ${sessionId} was not found`
        )
      }

      return paymentCollection[0]
    },

    async getPaymentCollectionIdByPaymentId(
      paymentId: string,
      config: FindConfig<PaymentCollection> = {}
    ): Promise<PaymentCollection> {
      const paymentCollection = await this.find({
        join: {
          alias: "payment_col",
          innerJoin: { payments: "payment_col.payments" },
        },
        where: {
          payments: {
            id: paymentId,
          },
        },
        relations: config.relations,
        select: config.select,
      })

      if (!paymentCollection.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Payment collection related to Payment id ${paymentId} was not found`
        )
      }

      return paymentCollection[0]
    },
  })
export default PaymentCollectionRepository
