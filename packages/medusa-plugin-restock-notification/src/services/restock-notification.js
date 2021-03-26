import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class RestockNotificationService extends BaseService {
  constructor(
    {
      manager,
      eventBusService,
      productVariantService,
      restockNotificationRepository,
    },
    options
  ) {
    super()

    this.manager_ = manager

    this.options_ = options

    this.productVariantService_ = productVariantService

    this.restockNotificationRepo_ = restockNotificationRepository

    this.eventBus_ = eventBusService
  }

  async retrieve(variantId) {
    const restockRepo = this.manager_.getCustomRepository(
      this.restockNotificationRepo_
    )
    return await restockRepo.findOne({ where: { variant_id: variantId } })
  }

  async addEmail(variantId, email) {
    return this.atomicPhase_(async (manager) => {
      const restockRepo = manager.getCustomRepository(
        this.restockNotificationRepo_
      )
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

  async triggerRestock(variantId) {
    return this.atomicPhase_(async (manager) => {
      const existing = await this.retrieve(variantId)
      if (!existing) {
        return
      }

      
    })
  }
}

export default RestockNotificationService
