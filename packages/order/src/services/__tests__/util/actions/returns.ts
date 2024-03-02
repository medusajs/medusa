import { OrderChangeEvent } from "../../../../types"
import { ChangeActionType, calculateOrderChange } from "../../../../utils"

describe("Order Return - Actions", function () {
  const originalOrder = {
    items: [
      {
        id: "1",
        quantity: 1,
        unit_price: 10,

        fulfilled_quantity: 1,
        return_requested_quantity: 0,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      {
        id: "2",
        quantity: 2,
        unit_price: 100,

        fulfilled_quantity: 1,
        return_requested_quantity: 0,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      {
        id: "3",
        quantity: 3,
        unit_price: 20,

        fulfilled_quantity: 3,
        return_requested_quantity: 0,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
    ],
    shipping_methods: [
      {
        id: "ship_123",
        price: 0,
      },
    ],
    total: 270,
    shipping_total: 0,
  }

  it("should validate return requests", function () {
    const actions = [
      {
        action: ChangeActionType.RETURN_ITEM,
        reference_id: "return_123",
        details: {
          reference_id: "1",
          quantity: 1,
        },
      },
    ] as OrderChangeEvent[]

    expect(() => {
      actions[0].details!.quantity = 2
      calculateOrderChange({
        order: originalOrder,
        actions,
      })
    }).toThrow(
      "Cannot request to return more items than what was fulfilled for item 1."
    )

    expect(() => {
      actions[0].details!.reference_id = undefined
      calculateOrderChange({
        order: originalOrder,
        actions,
      })
    }).toThrow("Details reference ID is required.")

    expect(() => {
      actions[0].details!.reference_id = "333"
      calculateOrderChange({
        order: originalOrder,
        actions,
      })
    }).toThrow(`Reference ID "333" not found.`)
  })

  it("should validate return received", function () {
    const [] = []
    const actions = [
      {
        action: ChangeActionType.RETURN_ITEM,
        reference_id: "return_123",
        details: {
          reference_id: "2",
          quantity: 1,
        },
      },
      {
        action: ChangeActionType.RETURN_ITEM,
        reference_id: "return_123",
        details: {
          reference_id: "3",
          quantity: 2,
        },
      },
    ] as OrderChangeEvent[]

    const changes = calculateOrderChange({
      order: originalOrder,
      actions,
    })

    expect(changes.order.items).toEqual([
      {
        id: "1",
        quantity: 1,
        unit_price: 10,
        fulfilled_quantity: 1,
        return_requested_quantity: 0,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      {
        id: "2",
        quantity: 2,
        unit_price: 100,
        fulfilled_quantity: 1,
        return_requested_quantity: 1,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      {
        id: "3",
        quantity: 3,
        unit_price: 20,
        fulfilled_quantity: 3,
        return_requested_quantity: 2,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
    ])

    const modifiedOrder = {
      ...originalOrder,
      items: [...changes.order.items],
    }

    expect(() => {
      calculateOrderChange({
        order: modifiedOrder,
        actions: [
          {
            action: ChangeActionType.RETURN_ITEM,
            details: {
              reference_id: "3",
              quantity: 2,
            },
          },
        ],
      })
    }).toThrow(
      "Cannot request to return more items than what was fulfilled for item 3."
    )

    expect(() => {
      calculateOrderChange({
        order: modifiedOrder,
        actions: [
          {
            action: ChangeActionType.RECEIVE_RETURN_ITEM,
            details: {
              reference_id: "3",
              quantity: 3,
            },
          },
        ],
      })
    }).toThrow(
      "Cannot receive more items than what was requested to be returned for item 3."
    )

    expect(() => {
      calculateOrderChange({
        order: modifiedOrder,
        actions: [
          {
            action: ChangeActionType.RECEIVE_RETURN_ITEM,
            details: {
              reference_id: "3",
              quantity: 1,
            },
          },
          {
            action: ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
            details: {
              reference_id: "3",
              quantity: 2,
            },
          },
        ],
      })
    }).toThrow(
      "Cannot receive more items than what was requested to be returned for item 3."
    )

    const receivedChanges = calculateOrderChange({
      order: modifiedOrder,
      actions: [
        {
          action: ChangeActionType.RECEIVE_RETURN_ITEM,
          details: {
            reference_id: "3",
            quantity: 1,
          },
        },
        {
          action: ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
          details: {
            reference_id: "3",
            quantity: 1,
          },
        },
      ],
    })

    expect(receivedChanges.order.items).toEqual([
      {
        id: "1",
        quantity: 1,
        unit_price: 10,
        fulfilled_quantity: 1,
        return_requested_quantity: 0,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      {
        id: "2",
        quantity: 2,
        unit_price: 100,
        fulfilled_quantity: 1,
        return_requested_quantity: 1,
        return_received_quantity: 0,
        return_dismissed_quantity: 0,
        written_off_quantity: 0,
      },
      {
        id: "3",
        quantity: 3,
        unit_price: 20,
        fulfilled_quantity: 3,
        return_requested_quantity: 0,
        return_received_quantity: 1,
        return_dismissed_quantity: 1,
        written_off_quantity: 0,
      },
    ])
  })
})
