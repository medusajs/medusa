import { MedusaError } from "medusa-core-utils"
import { PaymentCollection } from "./../models/payment-collection"
import { FindConfig } from "../types/common"
import { PaymentSession } from "../models"
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
        where: ((qb) => {
          qb.where(
            "payment_col_payment_sessions.payment_session_id = :sessionId",
            { sessionId }
          )
        }) as any,
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
        where: ((qb) => {
          qb.where("payment_col_payments.payment_id = :paymentId", {
            paymentId,
          })
        }) as any,
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

    async deleteMultiple(ids: string[]): Promise<void> {
      await this.createQueryBuilder()
        .delete()
        .from(PaymentSession)
        .where("id IN (:...ids)", { ids })
        .execute()
    },
  })

export default PaymentCollectionRepository
