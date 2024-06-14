import {
  Context,
  DAL,
  INotificationModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  NotificationTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  promiseAll,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import NotificationProviderService from "./notification-provider"
import { NotificationModel, NotificationProvider } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  notificationModelService: ModulesSdkTypes.IMedusaInternalService<any>
  notificationProviderService: NotificationProviderService
}

export default class NotificationModuleService
  extends MedusaService<{
    Notification: { dto: NotificationTypes.NotificationDTO }
  }>({ Notification: NotificationModel }, entityNameToLinkableKeysMap)
  implements INotificationModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly notificationService_: ModulesSdkTypes.IMedusaInternalService<NotificationModel>
  protected readonly notificationProviderService_: NotificationProviderService

  constructor(
    {
      baseRepository,
      notificationModelService,
      notificationProviderService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.notificationService_ = notificationModelService
    this.notificationProviderService_ = notificationProviderService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
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

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createNotifications_(
    data: NotificationTypes.CreateNotificationDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<NotificationModel[]> {
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
      alreadySentNotifications.map((n) => [n.idempotency_key, true])
    )

    const notificationsToProcess = data.filter(
      (entry) => !existsMap.has(entry.idempotency_key)
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
}
