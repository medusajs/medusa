import { INotificationModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type SendNotificationsStepInput = {
  to: string
  channel: string
  template: string
  data?: Record<string, unknown> | null
  trigger_type?: string | null
  resource_id?: string | null
  resource_type?: string | null
  receiver_id?: string | null
  original_notification_id?: string | null
  idempotency_key?: string | null
}[]

export const sendNotificationsStepId = "send-notifications"
export const sendNotificationsStep = createStep(
  sendNotificationsStepId,
  async (data: SendNotificationsStepInput, { container }) => {
    const service = container.resolve<INotificationModuleService>(
      ModuleRegistrationName.NOTIFICATION
    )
    const created = await service.createNotifications(data)
    return new StepResponse(
      created,
      created.map((notification) => notification.id)
    )
  }
  // Most of the notifications are irreversible, so we can't compensate notifications reliably
)
