import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableNotificationProps, NotificationDTO } from "./common"
import { CreateNotificationDTO } from "./mutations"

/**
 * The main service interface for the Notification Module.
 */
export interface INotificationModuleService extends IModuleService {
  /**
   * This method is used to send multiple notifications, and store the requests in the DB.
   *
   * @param {CreateNotificationDTO[]} data - The notifications to be sent.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NotificationDTO[]>} The list of sent notifications.
   *
   * @example
   * const notifications = await notificationModuleService.create([
   *   {
   *     to: "john@doe.me",
   *     template: "order-confirmation",
   *     channel: "email",
   *   },
   *   {
   *     to: "+38975123456",
   *     template: "order-confirmation",
   *     channel: "sms",
   *   },
   * ])
   */
  create(
    data: CreateNotificationDTO[],
    sharedContext?: Context
  ): Promise<NotificationDTO[]>

  /**
   * This method is used to send a notification, and store the request in the DB.
   *
   * @param {CreateNotificationDTO} data - The notification to be sent.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NotificationDTO>} The sent notification.
   *
   * @example
   * const notification = await notificationModuleService.create({
   *   to: "john@doe.me",
   *   template: "order-confirmation",
   *   channel: "email",
   * })
   */
  create(
    data: CreateNotificationDTO,
    sharedContext?: Context
  ): Promise<NotificationDTO>

  /**
   * This method is used to retrieve a notification by its ID
   *
   * @param {string} notificationId - The ID of the notification to retrieve.
   * @param {FindConfig<NotificationDTO>} config -
   * The configurations determining how the notification is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a notification.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NotificationDTO>} The retrieved notification.
   *
   * @example
   * A simple example that retrieves a notification by its ID:
   *
   * ```ts
   * const notification =
   *   await notificationModuleService.retrieve("noti_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const notification = await notificationModuleService.retrieve(
   *   "noti_123",
   *   {
   *     relations: ["provider"],
   *   }
   * )
   * ```
   */
  retrieve(
    notificationId: string,
    config?: FindConfig<NotificationDTO>,
    sharedContext?: Context
  ): Promise<NotificationDTO>

  /**
   * This method is used to retrieve a paginated list of notifications based on optional filters and configuration.
   *
   * @param {FilterableNotificationProps} filters - The filters to apply on the retrieved notifications.
   * @param {FindConfig<NotificationDTO>} config -
   * The configurations determining how the notifications are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a notification.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NotificationDTO[]>} The list of notifications.
   *
   * @example
   * To retrieve a list of notifications using their IDs:
   *
   * ```ts
   * const notifications = await notificationModuleService.list({
   *   id: ["noti_123", "noti_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the notifications:
   *
   * ```ts
   * const notifications = await notificationModuleService.list(
   *   {
   *     id: ["noti_123", "noti_321"],
   *   },
   *   {
   *     relations: ["provider"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const notifications = await notificationModuleService.list(
   *   {
   *     id: ["noti_123", "noti_321"],
   *   },
   *   {
   *     relations: ["provider"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  list(
    filters?: FilterableNotificationProps,
    config?: FindConfig<NotificationDTO>,
    sharedContext?: Context
  ): Promise<NotificationDTO[]>

  /**
   * This method is used to retrieve a paginated list of notifications along with the total count of available notifications satisfying the provided filters.
   *
   * @param {FilterableNotificationProps} filters - The filters to apply on the retrieved notifications.
   * @param {FindConfig<NotificationDTO>} config -
   * The configurations determining how the notifications are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a notification.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<NotificationDTO[]>} The list of notifications along with the total count.
   *
   * @example
   * To retrieve a list of notifications using their IDs:
   *
   * ```ts
   * const [notifications, count] =
   *   await notificationModuleService.listAndCount({
   *     id: ["noti_123", "noti_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the notifications:
   *
   * ```ts
   * const [notifications, count] =
   *   await notificationModuleService.listAndCount(
   *     {
   *       id: ["noti_123", "noti_321"],
   *     },
   *     {
   *       relations: ["provider"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [notifications, count] =
   *   await notificationModuleService.listAndCount(
   *     {
   *       id: ["noti_123", "noti_321"],
   *     },
   *     {
   *       relations: ["provider"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCount(
    filters?: FilterableNotificationProps,
    config?: FindConfig<NotificationDTO>,
    sharedContext?: Context
  ): Promise<[NotificationDTO[], number]>
}
