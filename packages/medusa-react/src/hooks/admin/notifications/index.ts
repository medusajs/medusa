/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Notification API Routes](https://docs.medusajs.com/api/admin#notifications).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Notifications are sent to customers to inform them of new updates. For example, a notification can be sent to the customer when their order is place or its state is updated.
 * The notification's type, such as an email or SMS, is determined by the notification provider installed on the Medusa backend.
 *
 * @customNamespace Hooks.Admin.Notifications
 */

export * from "./queries"
export * from "./mutations"
