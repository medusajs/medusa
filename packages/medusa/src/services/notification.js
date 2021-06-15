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
    this.attachmentGenerator_ = null
  }

  /**
   * Registers an attachment generator to the service. The generator can be
   * used to generate on demand invoices or other documents.
   */
  registerAttachmentGenerator(service) {
    this.attachmentGenerator_ = service
  }

  /**
   * Sets the service's manager to a given transaction manager.
   * @parma {EntityManager} transactionManager - the manager to use
   * return {NotificationService} a cloned notification service
   */
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

  /**
   * Takes a list of notification provider ids and persists them in the database.
   * @param {Array<string>} providers - a list of provider ids
   */
  async registerInstalledProviders(providers) {
    const { manager, notificationProviderRepository } = this.container_
    const model = manager.getCustomRepository(notificationProviderRepository)
    model.update({}, { is_installed: false })
    for (const p of providers) {
      const n = model.create({ id: p, is_installed: true })
      await model.save(n)
    }
  }

  /**
   * Retrieves a list of notifications.
   * @param {object} selector - the params to select the notifications by.
   * @param {object} config - the configuration to apply to the query
   * @return {Array<Notification>} the notifications that satisfy the query.
   */
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
   * Retrieves a notification with a given id
   * @param {string} id - the id of the notification
   * @return {Notification} the notification
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

  /**
   * Subscribes a given provider to an event.
   * @param {string} eventName - the event to subscribe to
   * @param {string} providerId - the provider that the event will be sent to
   */
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

  /**
   * Finds a provider with a given id. Will throw a NOT_FOUND error if the
   * resolution fails.
   * @param {string} id - the id of the provider
   * @return {NotificationProvider} the notification provider
   */
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

  /**
   * Handles an event by relaying the event data to the subscribing providers.
   * The result of the notification send will be persisted in the database in
   * order to allow for resends. Will log any errors that are encountered.
   * @param {string} eventName - the event to handle
   * @param {object} data - the data the event was sent with
   */
  handleEvent(eventName, data) {
    const subs = this.subscribers_[eventName]
    if (!subs) {
      return
    }

    if(data['no_notification'] === true) {
      return
    }

    return Promise.all(
      subs.map(async providerId => {
        return this.send(eventName, data, providerId).catch(err => {
          console.log(err)
          this.logger_.warn(
            `An error occured while ${providerId} was processing a notification for ${eventName}: ${err.message}`
          )
        })
      })
    )
  }

  /**
   * Sends a notification, by calling the given provider's sendNotification
   * method. Persists the Notification in the database.
   * @param {string} event - the name of the event
   * @param {object} eventData - the data the event was sent with
   * @param {string} providerId - the provider that should hande the event.
   * @return {Notification} the created notification
   */
  async send(event, eventData, providerId) {
    const provider = this.retrieveProvider_(providerId)
    const result = await provider.sendNotification(
      event,
      eventData,
      this.attachmentGenerator_
    )

    if (!result) {
      return
    }

    const { to, data } = result
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
      data,
      event_name: event,
      provider_id: providerId,
    })

    return notiRepo.save(created)
  }

  /**
   * Resends a notification by retrieving a prior notification and calling the
   * underlying provider's resendNotification method.
   * @param {string} id - the id of the notification
   * @param {object} config - any configuration that might override the previous
   *  send
   * @return {Notification} the newly created notification
   */
  async resend(id, config = {}) {
    const notification = await this.retrieve(id)

    const provider = this.retrieveProvider_(notification.provider_id)
    const { to, data } = await provider.resendNotification(
      notification,
      config,
      this.attachmentGenerator_
    )

    const notiRepo = this.manager_.getCustomRepository(
      this.notificationRepository_
    )
    const created = notiRepo.create({
      ...notification,
      to,
      data,
      parent_id: id,
    })

    return notiRepo.save(created)
  }
}

export default NotificationService
