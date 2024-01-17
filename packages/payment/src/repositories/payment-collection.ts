import { PaymentCollectionDTO } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { PaymentCollection } from "@models"

export class PaymentCollectionRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PaymentCollection,
  {
    create: PaymentCollectionDTO
  }
>(PaymentCollection) {}
