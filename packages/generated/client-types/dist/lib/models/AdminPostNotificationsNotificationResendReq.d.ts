/**
 * The resend details.
 */
export interface AdminPostNotificationsNotificationResendReq {
    /**
     * A new address or user identifier that the Notification should be sent to. If not provided, the previous `to` field of the notification will be used.
     */
    to?: string;
}
