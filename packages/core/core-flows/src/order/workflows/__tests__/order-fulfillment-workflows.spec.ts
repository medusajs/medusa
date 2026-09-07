import { createOrderFulfillmentWorkflow } from "../create-fulfillment"
import { createOrderShipmentWorkflow } from "../create-shipment"
import { cancelOrderFulfillmentWorkflow } from "../cancel-order-fulfillment"
import { markOrderFulfillmentAsDeliveredWorkflow } from "../mark-order-fulfillment-as-delivered"
import { listShippingOptionsForOrderWorkflow } from "../list-shipping-options-for-order"

describe("Order Fulfillment Workflows Definition", () => {
  it("should define createOrderFulfillmentWorkflow correctly", () => {
    expect(createOrderFulfillmentWorkflow.getName()).toEqual("create-order-fulfillment")
  })

  it("should define createOrderShipmentWorkflow correctly", () => {
    expect(createOrderShipmentWorkflow.getName()).toEqual("create-order-shipment")
  })

  it("should define cancelOrderFulfillmentWorkflow correctly", () => {
    expect(cancelOrderFulfillmentWorkflow.getName()).toEqual("cancel-order-fulfillment")
  })

  it("should define markOrderFulfillmentAsDeliveredWorkflow correctly", () => {
    expect(markOrderFulfillmentAsDeliveredWorkflow.getName()).toEqual("mark-order-fulfillment-as-delivered")
  })

  it("should define listShippingOptionsForOrderWorkflow correctly", () => {
    expect(listShippingOptionsForOrderWorkflow.getName()).toEqual("list-shipping-options-for-order")
  })
})
