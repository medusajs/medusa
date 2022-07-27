import { MedusaError } from "medusa-core-utils"
import {
  AbstractNotificationService,
  TransactionBaseService,
} from "../interfaces"
import { EntityManager } from "typeorm"
import { Logger } from "../types/global"
import { NotificationRepository } from "../repositories/notification"
import { NotificationProviderRepository } from "../repositories/notification-provider"
import { FindConfig, Selector } from "../types/common"
import { buildQuery } from "../utils"
import { Notification } from "../models"

type InjectedDependencies = {
  manager: EntityManager
  logger: Logger
  notificationRepository: typeof NotificationRepository
  notificationProviderRepository: typeof NotificationProviderRepository
}
type NotificationProviderKey = `noti_${string}`

class NotificationService extends TransactionBaseService<NotificationService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected subscribers_ = {}
  protected attachmentGenerator_: unknown = null
  protected readonly container_: InjectedDependencies & {
    [key in `${NotificationProviderKey}`]: AbstractNotificationService<never>
  }
  protected readonly logger_: Logger
  protected readonly notificationRepository_: typeof NotificationRepository
  protected readonly notificationProviderRepository_: typeof NotificationProviderRepository

  constructor(container: InjectedDependencies) {
    super(container)

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
  }

  /**
   * Registers an attachment generator to the service. The generator can be
   * used to generate on demand invoices or other documents.
   * @param service the service to assign to the attachmentGenerator
   */
  registerAttachmentGenerator(service: unknown): void {
    this.attachmentGenerator_ = service
  }

  /**
   * Takes a list of notification provider ids and persists them in the database.
   * @param providerIds - a list of provider ids
   */
  async registerInstalledProviders(providerIds: string[]): Promise<void> {
    const { manager, notificationProviderRepository } = this.container_
    const model = manager.getCustomRepository(notificationProviderRepository)
    await model.update({}, { is_installed: false })
    for (const id of providerIds) {
      const n = model.create({ id, is_installed: true })
      await model.save(n)
    }
  }

  /**
   * Retrieves a list of notifications.
   * @param selector - the params to select the notifications by.
   * @param config - the configuration to apply to the query
   * @return the notifications that satisfy the query.
   */
  async list(
    selector: Selector<Notification>,
    config: FindConfig<Notification> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<Notification[]> {
    const notiRepo = this.manager_.getCustomRepository(
      this.notificationRepository_
    )
    const query = buildQuery(selector, config)
    return await notiRepo.find(query)
  }

  /**
   * Retrieves a notification with a given id
   * @param id - the id of the notification
   * @param config - the configuration to apply to the query
   * @return the notification
   */
  async retrieve(
    id: string,
    config: FindConfig<Notification> = {}
  ): Promise<Notification | never> {
    const notiRepository = this.manager_.getCustomRepository(
      this.notificationRepository_
    )

    const query = buildQuery({ id }, config)

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
   * @param eventName - the event to subscribe to
   * @param providerId - the provider that the event will be sent to
   */
  subscribe(eventName: string, providerId: string): void {
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
   * @param id - the id of the provider
   * @return the notification provider
   */
  protected retrieveProvider_(id: string): AbstractNotificationService<never> {
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
   * @param eventName - the event to handle
   * @param data - the data the event was sent with
   * @return the result of notification subscribed
   */
  handleEvent(
    eventName: string,
    data: Record<string, unknown>
  ): Promise<void | undefined | Notification[]> {
    const subs = this.subscribers_[eventName]
    if (!subs) {
      return Promise.resolve()
    }
    if (data["no_notification"] === true) {
      return Promise.resolve()
    }

    return Promise.all(
      subs.map(async (providerId) => {
        return this.send(eventName, data, providerId).catch((err) => {
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
   * @param event - the name of the event
   * @param eventData - the data the event was sent with
   * @param providerId - the provider that should hande the event.
   * @return the created notification
   */
  async send(
    event: string,
    eventData: Record<string, unknown>,
    providerId: string
  ): Promise<Notification | undefined> {
    return await this.atomicPhase_(async (transactionManager) => {
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
      const notiRepo = transactionManager.getCustomRepository(
        this.notificationRepository_
      )

      const [resource_type] = event.split(".") as string[]
      const resource_id = eventData.id as string
      const customer_id = (eventData.customer_id as string) || null

      const created = notiRepo.create({
        resource_type,
        resource_id,
        customer_id,
        to,
        data,
        event_name: event,
        provider_id: providerId,
      })

      return await notiRepo.save(created)
    })
  }

  /**
   * Resends a notification by retrieving a prior notification and calling the
   * underlying provider's resendNotification method.
   * @param {string} id - the id of the notification
   * @param {object} config - any configuration that might override the previous
   *  send
   * @return {Notification} the newly created notification
   */
  async resend(
    id: string,
    config: FindConfig<Notification> = {}
  ): Promise<Notification> {
    return await this.atomicPhase_(async (transactionManager) => {
      const notification = await this.retrieve(id)

      const provider = this.retrieveProvider_(notification.provider_id)
      const { to, data } = await provider.resendNotification(
        notification,
        config,
        this.attachmentGenerator_
      )

      const notiRepo = transactionManager.getCustomRepository(
        this.notificationRepository_
      )
      const created = notiRepo.create({
        ...notification,
        to,
        data,
        parent_id: id,
      })

      return notiRepo.save(created)
    })
  }
}

export default NotificationService
