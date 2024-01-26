import { MedusaError } from "medusa-core-utils"
import { PaymentCollection } from "../models"
import { dataSource } from "../loaders/database"
import { FindManyOptions } from "typeorm"

export const PaymentCollectionRepository = dataSource
  .getRepository(PaymentCollection)
  .extend({
    async getPaymentCollectionIdBySessionId(
      sessionId: string,
      config: FindManyOptions<PaymentCollection> = {}
    ): Promise<PaymentCollection> {
      const paymentCollection = await this.find({
        where: {
          payment_sessions: {
            id: sessionId,
          },
        },
        relations: {
          ...(config.relations ?? {}),
          payment_sessions: true,
        },
        select: config.select ?? {},
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
      config: FindManyOptions<PaymentCollection> = {}
    ): Promise<PaymentCollection> {
      const paymentCollection = await this.find({
        where: {
          payments: {
            id: paymentId,
          },
        },
        relations: {
          ...(config.relations ?? {}),
          payment_sessions: true,
        },
        select: config.select ?? {},
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
