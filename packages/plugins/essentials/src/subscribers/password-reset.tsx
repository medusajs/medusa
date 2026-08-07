import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import type {
  ConfigModule,
  INotificationModuleService,
} from "@medusajs/framework/types"
import {
  AuthWorkflowEvents,
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { render } from "@react-email/render"
import { IEssentialsModuleService, PluginModule } from "../types"
import { PasswordResetEmail } from "../utils/email-templates/password-reset"
import { getAdminUrl } from "../utils/utils"

type PasswordResetEventData = {
  entity_id: string
  token: string
  actor_type: string
}

export default async function passwordResetHandler({
  event: {
    data: { entity_id: email, token, actor_type },
  },
  container,
}: SubscriberArgs<PasswordResetEventData>) {
  const essentials = container.resolve<IEssentialsModuleService>(
    PluginModule.ESSENTIALS
  )
  if (!(await essentials.isFeatureEnabled("email.password-reset"))) {
    return
  }

  const notificationModuleService =
    container.resolve<INotificationModuleService>(Modules.NOTIFICATION)
  const config = container.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const urlPrefix =
    actor_type === "customer"
      ? config.admin.storefrontUrl || getAdminUrl(config)
      : getAdminUrl(config)

  const resetUrl = `${urlPrefix}/reset-password?token=${token}&email=${encodeURIComponent(
    email
  )}`
  const storeName = (await essentials.getStoreName()) ?? "our store"
  const html = await render(
    <PasswordResetEmail
      resetUrl={resetUrl}
      email={email}
      storeName={storeName}
    />
  )

  await notificationModuleService.createNotifications({
    from: await essentials.getSenderEmail(),
    to: email,
    channel: "email",
    trigger_type: AuthWorkflowEvents.PASSWORD_RESET,
    content: {
      subject: "Reset your password",
      html,
    },
  })
}

export const config: SubscriberConfig = {
  event: AuthWorkflowEvents.PASSWORD_RESET,
  context: {
    subscriberId: "essentials-password-reset",
  },
}
