import { FormattingOptionsType } from "types"

const notificationOptions: FormattingOptionsType = {
  "^notification/.*AbstractNotificationProviderService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a notification provider module and the methods you must implement in it.`,
    frontmatterData: {
      slug: "/references/notification-provider-module",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Notification Provider Module",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    startSections: [
      `## 1. Create Module Directory

Start by creating a new directory for your module. For example, \`src/modules/my-notification\`.`,
      `## 2. Create the Notification Provider Service

Create the file \`src/modules/my-notification/service.ts\` that holds the implementation of the notification service.

The Notification Provider Module's main service must extend the \`AbstractNotificationProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-notification/service.ts"
import { 
  AbstractNotificationProviderService
} from "@medusajs/framework/utils"

class MyNotificationProviderService extends AbstractNotificationProviderService {
  // TODO add methods
}

export default MyNotificationProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Definition File

Create the file \`src/modules/my-notification/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-notification/index.ts"
import MyNotificationProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [MyNotificationProviderService],
})
\`\`\`

This exports the module's definition, indicating that the \`MyNotificationProviderService\` is the module's service.`,
      `## 4. Use Module

To use your Notification Module Provider, add it to the \`providers\` array of the Notification Module in \`medusa-config.ts\`:

<Note>

The Notification Module accepts one provider per channel.

</Note>

\`\`\`ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-notification",
            id: "my-notification",
            options: {
              channels: ["email"],
              // provider options...
            },
          },
        ],
      },
    },
  ]
})
\`\`\`

Make sure to specify the correct channels for your provider in the \`channels\` option.`,
      `## 5. Test it Out

### Create Subscriber

To test out the provider, create a subscriber at \`src/subscribers/user-created.ts\` with the following content:

\`\`\`ts title="src/subscribers/user-created.ts"
import { Modules } from "@medusajs/framework/utils"
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"

export default async function userCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const userModule = container.resolve(
    Modules.USER
  )

  const user = await userModule.retrieveUser(data.id)

  await notificationModuleService.createNotifications({
    to: user.email,
    channel: "email",
    template: "new-user"
  })
}

export const config: SubscriberConfig = {
  event: "user.created",
}
\`\`\`

In the subscriber, you resolve the Notification and User modules. Then, you use the User Module's main service to retrieve the user's details.

Finally, you use the Notification Module's main service to send a notification to the user's email through the \`email\` channel (assuming that's your provider's channel).

Make sure to replace the value of \`template\` to the ID of the template in your provider.

### Create User

Use the following command to create a user:

\`\`\`bash
npx medusa user -e admin@test.com -p supersecret
\`\`\`

After the user is created, the subscriber is executed, sending the notification using your provider.
`,
    ],
  },
}

export default notificationOptions
