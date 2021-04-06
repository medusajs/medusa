import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

import { RestockNotification } from "../models/restock-notification"

class RestockNotificationService extends BaseService {
  constructor({ manager, eventBusService, productVariantService }, options) {
    super()

    this.manager_ = manager

    this.options_ = options

    this.productVariantService_ = productVariantService

    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new RestockNotificationService({
      manager: transactionManager,
      options: this.options_,
      eventBusService: this.eventBus_,
      productVariantService: this.productVariantService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async retrieve(variantId) {
    const restockRepo = this.manager_.getRepository(RestockNotification)
    return await restockRepo.findOne({ where: { variant_id: variantId } })
  }

  async addEmail(variantId, email) {
    return this.atomicPhase_(async (manager) => {
      const restockRepo = manager.getRepository(RestockNotification)
      const existing = await this.retrieve(variantId)

      if (existing) {
        // Converting to a set handles duplicates for us
        const emailSet = new Set(existing.emails)
        emailSet.add(email)

        existing.emails = Array.from(emailSet)

        return await restockRepo.save(existing)
      } else {
        const variant = await this.productVariantService_.retrieve(variantId)

        if (variant.inventory_quantity > 0) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "You cannot sign up for restock notifications on a product that is not sold out"
          )
        }

        const created = restockRepo.create({
          variant_id: variant.id,
          emails: [email],
        })

        return await restockRepo.save(created)
      }
    })
  }

  async triggerRestock(variantId) {
    return this.atomicPhase_(async (manager) => {
      const restockRepo = manager.getRepository(RestockNotification)

      const existing = await this.retrieve(variantId)
      if (!existing) {
        return
      }

      const variant = await this.productVariantService_.retrieve(variantId)
      if (variant.inventory_quantity > 0) {
        await this.eventBus_
          .withTransaction(manager)
          .emit("restock_notification.restocked", {
            variant_id: variantId,
            emails: existing.emails,
          })
        await restockRepo.delete(variantId)
      }
    })
  }
}

export default RestockNotificationService
