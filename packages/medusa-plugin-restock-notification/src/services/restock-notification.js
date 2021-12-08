import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Restock notifications can be used to keep track of customers who wish to be
 * notified when a certain item is restocked. Restock notifications can only
 * apply to sold out items and will be deleted once items are restocked.
 */
class RestockNotificationService extends BaseService {
  constructor(
    {
      manager,
      eventBusService,
      productVariantService,
      restockNotificationModel,
    },
    options
  ) {
    super()

    this.manager_ = manager

    this.options_ = options

    this.productVariantService_ = productVariantService

    this.restockNotificationModel_ = restockNotificationModel

    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new RestockNotificationService(
      {
        manager: transactionManager,
        options: this.options_,
        eventBusService: this.eventBus_,
        productVariantService: this.productVariantService_,
        restockNotificationModel: this.restockNotificationModel_,
      },
      this.options_
    )

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Retrieves a restock notification by a given variant id.
   * @param {string} variantId - the variant id to retrieve restock notification
   *  for
   * @return {Promise<RestockNotification>} The restock notification
   */
  async retrieve(variantId) {
    const restockRepo = this.manager_.getRepository(
      this.restockNotificationModel_
    )
    return await restockRepo.findOne({ where: { variant_id: variantId } })
  }

  /**
   * Adds an email to be notified when a certain variant is restocked. Throws if
   * the variant is not sold out.
   * @param {string} variantId - the variant id to sign up for notifications for
   * @param {string} email - the email to signup
   * @return {Promise<RestockNotification>} The resulting restock notification
   */
  async addEmail(variantId, email) {
    return this.atomicPhase_(async (manager) => {
      const restockRepo = manager.getRepository(this.restockNotificationModel_)
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

  /**
   * Checks if anyone has signed up for restock notifications on a given variant
   * and emits a restocked event to the event bus. After successful emission the
   * restock notification is deleted.
   * @param {string} variantId - the variant id to trigger restock for
   * @return The resulting restock notification
   */
  async triggerRestock(variantId) {
    const delay = this.options_?.trigger_delay ?? 0
    if (delay) {
      return await this.eventBus_.emit(
        "restock-notification.execute",
        { variant_id: variantId },
        { delay }
      )
    }

    return await this.restockExecute(variantId)
  }

  async restockExecute(variantId) {
    return await this.atomicPhase_(async (manager) => {
      const restockRepo = manager.getRepository(this.restockNotificationModel_)

      const existing = await this.retrieve(variantId)
      if (!existing) {
        return
      }

      const variant = await this.productVariantService_.retrieve(variantId)

      if (
        variant.inventory_quantity > (this.options_?.inventory_required ?? 0)
      ) {
        await this.eventBus_
          .withTransaction(manager)
          .emit("restock-notification.restocked", {
            variant_id: variantId,
            emails: existing.emails,
          })
        await restockRepo.delete(variantId)
      }
    })
  }
}

export default RestockNotificationService
