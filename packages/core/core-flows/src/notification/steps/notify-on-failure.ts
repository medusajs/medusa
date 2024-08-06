import { INotificationModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type NotifyOnFailureStepInput = {
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

export const notifyOnFailureStepId = "notify-on-failure"
export const notifyOnFailureStep = createStep(
  notifyOnFailureStepId,
  async (data: NotifyOnFailureStepInput) => {
    return new StepResponse(void 0, data)
  },

  async (data, { container }) => {
    if (!data) {
      return
    }

    const service = container.resolve<INotificationModuleService>(
      ModuleRegistrationName.NOTIFICATION
    )
    await service.createNotifications(data)
  }
)
