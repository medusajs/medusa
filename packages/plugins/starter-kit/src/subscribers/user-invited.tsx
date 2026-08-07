import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import type {
  ConfigModule,
  INotificationModuleService,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  InviteWorkflowEvents,
  Modules,
} from "@medusajs/framework/utils"
import { render } from "@react-email/render"
import { IStarterKitModuleService, PluginModule } from "../types"
import { InviteUserEmail } from "../utils/email-templates/invite-user"
import { getAdminUrl } from "../utils/utils"

export default async function userInvitedHandler({
  event: { data, name },
  container,
}: SubscriberArgs<{ id: string }>) {
  const starterKit = container.resolve<IStarterKitModuleService>(
    PluginModule.STARTER_KIT
  )
  if (!(await starterKit.isFeatureEnabled("email.invite"))) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notificationModuleService =
    container.resolve<INotificationModuleService>(Modules.NOTIFICATION)
  const config = container.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const {
    data: [invite],
  } = await query.graph({
    entity: "invite",
    fields: ["email", "token"],
    filters: {
      id: data.id,
    },
  })

  if (!invite?.email || !invite?.token) {
    return
  }

  const inviteUrl = `${getAdminUrl(config)}/invite?token=${invite.token}`
  const storeName = (await starterKit.getStoreName()) ?? "our store"
  const html = await render(
    <InviteUserEmail
      inviteUrl={inviteUrl}
      email={invite.email}
      storeName={storeName}
    />
  )

  await notificationModuleService.createNotifications({
    from: await starterKit.getSenderEmail(),
    to: invite.email,
    channel: "email",
    trigger_type: name,
    resource_id: data.id,
    resource_type: "invite",
    content: {
      subject: `You've been invited to join ${storeName}`,
      html,
    },
  })
}

export const config: SubscriberConfig = {
  event: [InviteWorkflowEvents.CREATED, InviteWorkflowEvents.RESENT],
  context: {
    subscriberId: "starter-kit-user-invited",
  },
}
