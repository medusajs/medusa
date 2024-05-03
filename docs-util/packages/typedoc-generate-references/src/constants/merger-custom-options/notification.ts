import { FormattingOptionsType } from "types"

const notificationOptions: FormattingOptionsType = {
  "^notification/.*AbstractNotificationService": {
    reflectionGroups: {
      Properties: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a notification provider in the Medusa backend and the methods you must implement in it. Learn more about the notification architecture in [this documentation](https://docs.medusajs.com/development/notification/overview)`,
    frontmatterData: {
      slug: "/references/notification-service",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Notification Provider",
    },
    endSections: [
      `## Subscribe with Loaders

After creating your Notification Provider Service, you must create a [Loader](https://docs.medusajs.com/development/loaders/overview) that registers this Service as a notification handler of events.

For example, to register the \`email-sender\` Notification Provider as a handler for the \`order.placed\` event, create the file \`src/loaders/notification.ts\` with the following content:

\`\`\`ts title="src/loaders/notification.ts"
import { 
  MedusaContainer, 
  NotificationService,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer
): Promise<void> => {
  const notificationService = container.resolve<
    NotificationService
  >("notificationService")

  notificationService.subscribe(
    "order.placed", 
    "email-sender"
  )
}
\`\`\`

This loader accesses the \`notificationService\` through the [MedusaContainer](https://docs.medusajs.com/development/fundamentals/dependency-injection). The \`notificationService\` has a \`subscribe\` method that accepts 2 parameters. The first one is the name of the event to subscribe to, and the second is the identifier of the Notification Provider that's subscribing to that event.`,
      `## Test Sending a Notification

Make sure you have an event bus module configured in your Medusa backend. You can learn more on how to do that in the [Configurations guide](https://docs.medusajs.com/development/backend/configurations#modules).

Then:

1\\. Run the \`build\` command in the root directory of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start your Medusa backend:

\`\`\`bash npm2yarn
npx medusa develop
\`\`\`

3\\. Place an order either using the [REST APIs](https://docs.medusajs.com/api/store) or using the [storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter).

4\\. After placing an order, you can see in your console the message “Notification Sent”. If you added your own notification sending logic, you should receive an email or alternatively the type of notification you’ve set up.`,
      `## Test Resending a Notification

To test resending a notification:

1. Retrieve the ID of the notification you just sent using the [List Notifications API Route](https://docs.medusajs.com/api/admin#notifications_getnotifications). You can pass as a body parameter the \`to\` or \`event_name\` parameters to filter out the notification you just sent.

2. Send a request to the [Resend Notification API Route](https://docs.medusajs.com/api/admin#notifications_postnotificationsnotificationresend) using the ID retrieved from the previous request. You can pass the \`to\` parameter in the body to change the receiver of the notification. 

3. You should see the message “Notification Resent” in your console.
      `,
    ],
  },
}

export default notificationOptions
