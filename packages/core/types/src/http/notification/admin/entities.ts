export interface AdminNotification {
  id: string
  to: string
  channel: string
  template: string
  data?: Record<string, unknown> | null
  trigger_type?: string | null
  resource_id?: string | null
  resource_type?: string | null
  receiver_id?: string | null
  original_notification_id?: string | null
  external_id?: string | null
  provider_id: string
  created_at: string
}
