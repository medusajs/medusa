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
        emailSet.push(email)

        existing.emails = Array.from(emailSet)

        return await restockRepo.save(existing)
      } else {
        const variant = await productVariantService.retrieve(variantId)

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

  async delete(variantId) {
    return this.atomicPhase_(async (manager) => {
      const restockRepo = manager.getRepository(RestockNotification)
      return restockRepo.delete(variantId)
    })
  }

  async triggerRestock(variantId) {
    return this.atomicPhase_(async (manager) => {
      const existing = await this.retrieve(variantId)
      if (!existing) {
        return
      }

      const variant = await this.productVariantService_.retrieve(variantId)
      if (variant.inventory_quantity > 0) {
        await eventBus_
          .withTransaction(manager)
          .emit("restock_notification.restocked")
        await this.delete(variantId)
      }
    })
  }
}

export default RestockNotificationService
