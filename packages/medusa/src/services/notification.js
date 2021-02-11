import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import _ from "lodash"

/**
 * Provides layer to manipulate orchestrate notifications.
 * @implements BaseService
 */
class NotificationService extends BaseService {
  constructor(container) {
    super()

    const {
      manager,
      notificationProviderRepository,
      notificationRepository,
      logger,
    } = container

    this.container_ = container

    /** @private @const {EntityManager} */
    this.manager_ = manager
    this.logger_ = logger

    /** @private @const {NotificationRepository} */
    this.notificationRepository_ = notificationRepository
    this.notificationProviderRepository_ = notificationProviderRepository

    this.subscribers_ = {}
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new LineItemService({
      manager: transactionManager,
      notificationRepository: this.notificationRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async registerInstalledProviders(providers) {
    const { manager, notificationProviderRepository } = this.container_
    const model = manager.getCustomRepository(notificationProviderRepository)
    model.update({}, { is_installed: false })
    for (const p of providers) {
      const n = model.create({ id: p, is_installed: true })
      await model.save(n)
    }
  }

  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const notiRepo = this.manager_.getCustomRepository(
      this.notificationRepository_
    )
    const query = this.buildQuery_(selector, config)
    return notiRepo.find(query)
  }

  /**
   * Retrieves a line item by its id.
   * @param {string} id - the id of the line item to retrieve
   * @return {LineItem} the line item
   */
  async retrieve(id, config = {}) {
    const notiRepository = this.manager_.getCustomRepository(
      this.notificationRepository_
    )

    const validatedId = this.validateId_(id)
    const query = this.buildQuery_({ id: validatedId }, config)

    const notification = await notiRepository.findOne(query)

    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Notification with id: ${id} was not found.`
      )
    }

    return notification
  }

  subscribe(eventName, providerId) {
    if (typeof providerId !== "string") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "providerId must be a string"
      )
    }

    if (this.subscribers_[eventName]) {
      this.subscribers_[eventName].push(providerId)
    } else {
      this.subscribers_[eventName] = [providerId]
    }
  }

  retrieveProvider_(id) {
    try {
      return this.container_[`noti_${id}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a notification provider with id: ${id}.`
      )
    }
  }

  handleEvent(eventName, data) {
    const subs = this.subscribers_[eventName]
    if (!subs) {
      return
    }

    return Promise.all(
      subs.map(async providerId => {
        return this.send(eventName, data, providerId).catch(err => {
          this.logger_.warn(
            `An error occured while ${providerId} was processing a notification for ${eventName}: ${err.message}`
          )
        })
      })
    )
  }

  async send(event, eventData, providerId) {
    const provider = this.retrieveProvider_(providerId)
    const { to, data, status } = await provider.sendNotification(
      event,
      eventData
    )

    const notiRepo = this.manager_.getCustomRepository(
      this.notificationRepository_
    )

    const [resource_type] = event.split(".")
    const resource_id = eventData.id
    const customer_id = eventData.customer_id || null

    const created = notiRepo.create({
      resource_type,
      resource_id,
      customer_id,
      to,
      status,
      data,
      event_name: event,
      provider_id: providerId,
    })

    return notiRepo.save(created)
  }

  async resend(id, config = {}) {
    const notification = await this.retrieve(id)

    const provider = this.retrieveProvider_(notification.provider_id)
    const { to, data, status } = await provider.resendNotification(
      notification,
      config
    )

    const created = notiRepo.create({
      ...notification,
      to,
      data,
      status,
      parent_id: id,
    })

    return notiRepo.save(created)
  }
}

export default NotificationService
