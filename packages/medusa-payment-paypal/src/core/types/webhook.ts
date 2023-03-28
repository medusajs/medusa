import { Links } from "./common"

export interface WebhookEvent {
  id?: string
  create_time?: string
  event_version?: string
  links?: Links
  resource?: any
  resource_type?: string
  resource_version?: string
  summary?: string
}

export interface VerifyWebhookSignature {
  auth_algo: string
  cert_url: string
  transmission_id: string
  transmission_sig: string
  transmission_time: string
  webhook_event: WebhookEvent
  webhook_id: string
}
