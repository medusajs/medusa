import { Logger } from "@medusajs/framework/types"
import { SlackNotificationService } from "../services/slack"

describe("SlackNotificationService", () => {
  let service: SlackNotificationService
  const mockLogger: Logger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  } as any

  const webhookUrl = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX"

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it("should initialize with valid webhook URL", () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    expect(service).toBeDefined()
  })

  it("should throw error if webhook_url is missing", () => {
    expect(() => {
      new SlackNotificationService({ logger: mockLogger }, { webhook_url: "" })
    }).toThrow("Slack webhook_url is required")
  })

  it("should throw error if no notification provided", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    await expect(service.send(null as any)).rejects.toThrow(
      "No notification information provided"
    )
  })

  it("should throw error if recipient (to) is missing", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    await expect(
      service.send({
        to: "",
        channel: "slack",
        template: "test",
        data: {},
      })
    ).rejects.toThrow("Notification recipient (to) is required for Slack")
  })

  it("should successfully send notification with content", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    })

    const result = await service.send({
      to: "C1234567890",
      channel: "slack",
      template: "order.placed",
      content: {
        subject: "New Order Placed",
        html: "<p>Your order has been confirmed</p>",
      },
      data: {
        order_id: "order_123",
        customer: "John Doe",
        total: "$99.99",
      },
    })

    expect(result).toEqual({})
    expect(global.fetch).toHaveBeenCalledWith(webhookUrl, expect.any(Object))
  })

  it("should successfully send notification with template and data", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    })

    const result = await service.send({
      to: "C1234567890",
      channel: "slack",
      template: "payment.received",
      data: {
        amount: "$50.00",
        status: "completed",
      },
    })

    expect(result).toEqual({})
    expect(global.fetch).toHaveBeenCalled()

    // Verify the payload structure
    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const payload = JSON.parse(callArgs[1].body)
    expect(payload.channel).toBe("C1234567890")
    expect(payload.username).toBe("Medusa")
    expect(payload.icon_emoji).toBe(":package:")
    expect(payload.blocks).toBeDefined()
    expect(Array.isArray(payload.blocks)).toBe(true)
  })

  it("should handle Slack API errors", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => "invalid_token",
    })

    await expect(
      service.send({
        to: "C1234567890",
        channel: "slack",
        template: "test",
      })
    ).rejects.toThrow("Failed to send Slack notification")
  })

  it("should handle network errors", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      { webhook_url: webhookUrl }
    )

    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network timeout")
    )

    await expect(
      service.send({
        to: "C1234567890",
        channel: "slack",
        template: "test",
      })
    ).rejects.toThrow("Failed to send Slack notification")

    expect(mockLogger.error).toHaveBeenCalled()
  })

  it("should use custom bot name and emoji", async () => {
    service = new SlackNotificationService(
      { logger: mockLogger },
      {
        webhook_url: webhookUrl,
        bot_name: "Custom Bot",
        icon_emoji: ":robot_face:",
      }
    )

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    })

    await service.send({
      to: "C1234567890",
      channel: "slack",
      template: "test",
    })

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const payload = JSON.parse(callArgs[1].body)
    expect(payload.username).toBe("Custom Bot")
    expect(payload.icon_emoji).toBe(":robot_face:")
  })
})
