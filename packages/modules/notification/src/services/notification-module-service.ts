import {
  Context,
  DAL,
  Event,
  InferEntityType,
  INotificationModuleService,
  InternalModuleDeclaration,
  Logger,
  ModulesSdkTypes,
  NotificationTypes,
} from "@medusajs/types"
import {
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  promiseAll,
} from "@medusajs/utils"
import { Notification } from "@models"
import { eventBuilders } from "@utils"
import NotificationProviderService from "./notification-provider"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  notificationService: ModulesSdkTypes.IMedusaInternalService<
    typeof Notification
  >
  notificationProviderService: NotificationProviderService
  logger: Logger
}

type EventNotificationData = {
  resourceId: string
  to: string
}

export default class NotificationModuleService
  extends MedusaService<{
    Notification: { dto: NotificationTypes.NotificationDTO }
  }>({ Notification })
  implements INotificationModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly notificationService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Notification
  >
  protected readonly notificationProviderService_: NotificationProviderService
  protected readonly logger_: Logger

  protected subscribers: {
    [event: string]: { provider: string; config: { channels: string[] } }[]
  } = {}

  constructor(
    {
      baseRepository,
      notificationService,
      notificationProviderService,
      logger,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.notificationService_ = notificationService
    this.notificationProviderService_ = notificationProviderService
    this.logger_ = logger
  }

  __hooks = {
    onApplicationStart: async () => {
      await this.registerSubscribers()
    },
  }

  async registerSubscribers() {
    const providerSubscriptions =
      this.notificationProviderService_.registerSubscribers()

    providerSubscriptions.forEach(({ provider, events }) => {
      Object.entries(events).forEach(([event, config]) => {
        this.subscribe(event, provider, config)
      })
    })
  }

  subscribe(
    event: string | string[],
    provider: string,
    config: { channels: string[] }
  ): void {
    const events = Array.isArray(event) ? event : [event]

    events.forEach((e) => {
      if (!this.subscribers[e]) {
        this.subscribers[e] = []
      }

      this.subscribers[e].push({ provider, config })
    })
  }

  // @ts-expect-error
  createNotifications(
    data: NotificationTypes.CreateNotificationDTO[],
    sharedContext?: Context
  ): Promise<NotificationTypes.NotificationDTO[]>
  createNotifications(
    data: NotificationTypes.CreateNotificationDTO,
    sharedContext?: Context
  ): Promise<NotificationTypes.NotificationDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createNotifications(
    data:
      | NotificationTypes.CreateNotificationDTO
      | NotificationTypes.CreateNotificationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    NotificationTypes.NotificationDTO | NotificationTypes.NotificationDTO[]
  > {
    const normalized = Array.isArray(data) ? data : [data]

    const createdNotifications = await this.createNotifications_(
      normalized,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      NotificationTypes.NotificationDTO[]
    >(createdNotifications)

    eventBuilders.createdNotification({
      data: serialized,
      sharedContext,
    })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createNotifications_(
    data: NotificationTypes.CreateNotificationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Notification>[]> {
    if (!data.length) {
      return []
    }

    // TODO: At this point we should probably take a lock with the idempotency keys so we don't have race conditions.
    // Also, we should probably rely on Redis for this instead of the database.
    const idempotencyKeys = data
      .map((entry) => entry.idempotency_key)
      .filter(Boolean)
    const alreadySentNotifications = await this.notificationService_.list(
      {
        idempotency_key: idempotencyKeys,
      },
      { take: null },
      sharedContext
    )

    const existsMap = new Map(
      alreadySentNotifications.map((n) => [n.idempotency_key as string, true])
    )

    const notificationsToProcess = data.filter(
      (entry) => !entry.idempotency_key || !existsMap.has(entry.idempotency_key)
    )

    const notificationsToCreate = await promiseAll(
      notificationsToProcess.map(async (entry) => {
        const provider =
          await this.notificationProviderService_.getProviderForChannel(
            entry.channel
          )

        if (!provider) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Could not find a notification provider for channel: ${entry.channel}`
          )
        }

        if (!provider.is_enabled) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Notification provider ${provider.id} is not enabled. To enable it, configure it as a provider in the notification module options.`
          )
        }

        const res = await this.notificationProviderService_.send(
          provider,
          entry
        )
        return { ...entry, provider_id: provider.id, external_id: res.id }
      })
    )

    // Currently we store notifications after they are sent, which might result in a notification being sent that is not registered in the database.
    // If necessary, we can switch to a two-step process where we first create the notification, send it, and update it after it being sent.
    const createdNotifications = await this.notificationService_.create(
      notificationsToCreate,
      sharedContext
    )

    return createdNotifications
  }

  private buildNotificationData<T extends EventNotificationData>(
    event: Event<T>,
    config: { channels: string[] }
  ) {
    const data = {
      template: "", // QUESTION: Do we need templates? Isn't that somewhat specific to SendGrid?
      to: event.data.to ?? "",
      trigger_type: event.name,
      resource_id: event.data.resourceId,
      data: event.data,
    }

    return config.channels.map((channel) => ({
      ...data,
      channel,
    }))
  }

  async handleEvent<T extends EventNotificationData>(
    event: Event<T>
  ): Promise<void> {
    const subscribers = this.subscribers[event.name] ?? []

    await promiseAll(
      subscribers.map(async ({ provider: providerId, config }) => {
        const notifications = this.buildNotificationData(event, config)

        try {
          await this.createNotifications(notifications)
        } catch (err) {
          this.logger_.error(
            `Failed to send notification for ${event.name}`,
            err.message
          )
        }
      })
    )
  }
}
