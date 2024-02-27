import SendGridService from "../sendgrid"
import SendGrid from "@sendgrid/mail"

jest.genMockFromModule("@sendgrid/mail")
jest.mock("@sendgrid/mail")

const mockedSendGrid = SendGrid
mockedSendGrid.setApiKey.mockResolvedValue(mockedSendGrid)
mockedSendGrid.send.mockResolvedValue(Promise.resolve())

describe("SendGridService", () => {
  let sendGridService

  const totalsService = {
    withTransaction: function () {
      return this
    },
    getCalculationContext: jest.fn().mockImplementation((order, lineItems) => {
      return Promise.resolve({})
    }),
    getLineItemTotals: jest.fn().mockImplementation(() => {
      return Promise.resolve({})
    }),
    getLineItemRefund: () => {},
    getTotal: (o) => {
      return o.total || 0
    },
    getGiftCardableAmount: (o) => {
      return o.subtotal || 0
    },
    getRefundedTotal: (o) => {
      return o.refunded_total || 0
    },
    getShippingTotal: (o) => {
      return o.shipping_total || 0
    },
    getGiftCardTotal: (o) => {
      return o.gift_card_total || 0
    },
    getDiscountTotal: (o) => {
      return o.discount_total || 0
    },
    getTaxTotal: (o) => {
      return o.tax_total || 0
    },
    getSubtotal: (o) => {
      return o.subtotal || 0
    },
    getPaidTotal: (o) => {
      return o.paid_total || 0
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call SendGrid.send when template is configured and correct data is passed", async () => {
    const orderServiceMock = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          email: "test@test.com",
          currency_code: "usd",
          items: [],
          discounts: [],
          gift_cards: [],
          created_at: new Date(),
        })
      }),
    }

    sendGridService = new SendGridService(
      { orderService: orderServiceMock, totalsService },
      {
        api_key: "SG.test",
        order_placed_template: "lol",
      }
    )

    await sendGridService.sendNotification("order.placed", { id: "test" })
    expect(mockedSendGrid.send).toBeCalled()
  })

  it("should failed to send an email when event does not exist", async () => {
    expect.assertions(1)
    const orderServiceMock = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          email: "test@test.com",
          currency_code: "usd",
          items: [],
          discounts: [],
          gift_cards: [],
          created_at: new Date(),
        })
      }),
    }

    sendGridService = new SendGridService(
      { orderService: orderServiceMock, totalsService },
      {
        api_key: "SG.test",
        order_placed_template: "lol",
      }
    )

    try {
      await sendGridService.sendNotification("some.non-existing_event", {
        id: "test",
      })
    } catch (error) {
      expect(error.message).toEqual(
        "Sendgrid service: No template was set for event: some.non-existing_event"
      )
    }
  })

  it("should failed to send an email when template id is not configured", async () => {
    expect.assertions(1)
    const orderServiceMock = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          email: "test@test.com",
          currency_code: "usd",
          items: [],
          discounts: [],
          gift_cards: [],
          created_at: new Date(),
        })
      }),
    }

    sendGridService = new SendGridService(
      { orderService: orderServiceMock, totalsService },
      {
        api_key: "SG.test",
      }
    )

    try {
      await sendGridService.sendNotification("order.placed", {
        id: "test",
      })
    } catch (error) {
      expect(error.message).toEqual(
        "Sendgrid service: No template was set for event: order.placed"
      )
    }
  })

  it("should use localized template to send an email", async () => {
    const cartServiceMock = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          context: {
            locale: "de-DE",
          },
        })
      }),
    }
    const orderServiceMock = {
      retrieve: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          email: "test@test.com",
          currency_code: "usd",
          items: [],
          discounts: [],
          gift_cards: [],
          created_at: new Date(),
          cart_id: "test-id",
        })
      }),
    }

    sendGridService = new SendGridService(
      {
        orderService: orderServiceMock,
        totalsService,
        cartService: cartServiceMock,
      },
      {
        api_key: "SG.test",
        localization: {
          "de-DE": {
            order_placed_template: "lol",
          },
        },
      }
    )

    await sendGridService.sendNotification("order.placed", {
      id: "test",
    })
    expect(mockedSendGrid.send).toBeCalled()
  })

  it("should send message to non predefined template", async () => {
    sendGridService = new SendGridService({}, { "send-otp": "test-template" })

    await sendGridService.sendNotification("send-otp", {
      otp: "test",
      validity: "12-01-2020",
    })
    expect(mockedSendGrid.send).toBeCalled()
    expect(mockedSendGrid.send).toHaveBeenCalledWith(
      expect.objectContaining({
        template_id: "test-template",
        dynamic_template_data: {
          otp: "test",
          validity: "12-01-2020",
        },
      })
    )
  })
})
