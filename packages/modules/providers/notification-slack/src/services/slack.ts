import {
  Logger,
  NotificationTypes,
} from "@medusajs/framework/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"

type InjectedDependencies = {
  logger: Logger
}

interface SlackServiceConfig {
  webhook_url: string
  bot_name?: string
  icon_emoji?: string
}

export interface SlackNotificationServiceOptions {
  webhook_url: string
  bot_name?: string
  icon_emoji?: string
}

/**
 * Slack notification provider service.
 *
 * Sends Medusa notifications to Slack channels via incoming webhooks.
 * Supports rich message formatting using Slack's Block Kit.
 *
 * @example
 * ```typescript
 * // In medusa-config.ts
 * const config = {
 *   modules: {
 *     notification: {
 *       providers: [
 *         {
 *           resolve: "@medusajs/notification-slack",
 *           options: {
 *             webhook_url: process.env.SLACK_WEBHOOK_URL,
 *             bot_name: "Medusa Commerce",
 *             icon_emoji: ":package:",
 *           },
 *         },
 *       ],
 *     },
 *   },
 * }
 * ```
 */
export class SlackNotificationService extends AbstractNotificationProviderService {
  static identifier = "notification-slack"
  protected config_: SlackServiceConfig
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: SlackNotificationServiceOptions
  ) {
    super()

    if (!options.webhook_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Slack webhook_url is required"
      )
    }

    this.config_ = {
      webhook_url: options.webhook_url,
      bot_name: options.bot_name || "Medusa",
      icon_emoji: options.icon_emoji || ":package:",
    }
    this.logger_ = logger
  }

  /**
   * Sends a notification to Slack.
   *
   * @param notification - The notification data to send
   * @returns An empty object on success
   * @throws {MedusaError} If the webhook URL is invalid or the API call fails
   *
   * @example
   * ```typescript
   * await slackService.send({
   *   to: "C1234567890",  // Slack channel ID
   *   channel: "slack",
   *   template: "order.placed",
   *   data: {
   *     order_id: "order_123",
   *     customer_name: "Azhar Doe",
   *     total: "$99.99",
   *   },
   * })
   * ```
   */
  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No notification information provided"
      )
    }

    if (!notification.to) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Notification recipient (to) is required for Slack"
      )
    }

    try {
      // Build Slack message payload
      const message = this.buildSlackMessage(notification)

      // Send to Slack webhook
      const response = await fetch(this.config_.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Slack API error: ${error}`)
      }

      return {}
    } catch (error) {
      this.logger_.error(
        `Failed to send Slack notification: ${error.message}`
      )
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send Slack notification: ${error.message}`
      )
    }
  }

  /**
   * Builds a Slack message payload from Medusa notification data.
   *
   * @param notification - The notification data
   * @returns A Slack message payload
   */
  private buildSlackMessage(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): {
    channel?: string
    username: string
    icon_emoji: string
    blocks: Array<Record<string, any>>
    text?: string
  } {
    const content = notification.content
    const data = notification.data as Record<string, any> | undefined

    // Extract title and message text
    let title = "Medusa Notification"
    let text = "A new notification has been received"

    if (content?.subject) {
      title = content.subject
    }

    if (content?.html) {
      // Strip HTML tags for plain text
      text = content.html.replace(/<[^>]*>/g, "").trim()
    } else if (data) {
      // Build text from data fields
      text = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    }

    // Build notification template data
    const headerText =
      notification.template || notification.channel || "Notification"

    // Create Slack blocks
    const blocks: Array<Record<string, any>> = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: title,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: text || "_No additional information_",
        },
      },
    ]

    // Add context block with template/channel info
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `_Template: ${headerText} | Channel: ${notification.channel}_`,
        },
      ],
    })

    // Add additional data fields if available
    if (data && Object.keys(data).length > 0) {
      const fields: Array<Record<string, any>> = []

      Object.entries(data).slice(0, 8).forEach(([key, value]) => {
        fields.push({
          type: "mrkdwn",
          text: `*${key}:*\n${value}`,
        })
      })

      if (fields.length > 0) {
        blocks.push({
          type: "section",
          fields: fields,
        })
      }
    }

    return {
      channel: notification.to,
      username: this.config_.bot_name!,
      icon_emoji: this.config_.icon_emoji!,
      blocks: blocks,
      text: title, // Fallback for notifications
    }
  }
}
