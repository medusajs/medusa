import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  /**
   * List orders
   */
  route.get("/", middlewares.wrap(require("./list-orders").default))

  /**
   * Get an order
   */
  route.get("/:id", middlewares.wrap(require("./get-order").default))

  /**
   * Create a new order
   */
  route.post("/", middlewares.wrap(require("./create-order").default))

  /**
   * Update an order
   */
  route.post("/:id", middlewares.wrap(require("./update-order").default))

  /**
   * Mark an order as completed
   */
  route.post(
    "/:id/complete",
    middlewares.wrap(require("./complete-order").default)
  )

  /**
   * Refund an amount to the customer's card.
   */
  route.post(
    "/:id/refund",
    middlewares.wrap(require("./refund-payment").default)
  )

  /**
   * Capture the authorized amount on the customer's card.
   */
  route.post(
    "/:id/capture",
    middlewares.wrap(require("./capture-payment").default)
  )

  /**
   * Create a fulfillment.
   */
  route.post(
    "/:id/fulfillment",
    middlewares.wrap(require("./create-fulfillment").default)
  )

  /**
   * Create a shipment.
   */
  route.post(
    "/:id/shipment",
    middlewares.wrap(require("./create-shipment").default)
  )

  /**
   * Request a return.
   */
  route.post(
    "/:id/return",
    middlewares.wrap(require("./request-return").default)
  )

  /**
   * Register a requested return
   */
  route.post(
    "/:id/return/:return_id/receive",
    middlewares.wrap(require("./receive-return").default)
  )

  /**
   * Cancel an order.
   */
  route.post("/:id/cancel", middlewares.wrap(require("./cancel-order").default))

  /**
   * Archive an order.
   */
  route.post(
    "/:id/archive",
    middlewares.wrap(require("./archive-order").default)
  )

  /**
   * Set metadata key / value pair.
   */
  route.post(
    "/:id/metadata",
    middlewares.wrap(require("./set-metadata").default)
  )

  /**
   * Delete metadata key / value pair.
   */
  route.delete(
    "/:id/metadata/:key",
    middlewares.wrap(require("./delete-metadata").default)
  )

  return app
}
