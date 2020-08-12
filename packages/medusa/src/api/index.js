import { Router } from "express"
import admin from "./routes/admin"
import store from "./routes/store"
import errorHandler from "./middlewares/error-handler"

// guaranteed to get dependencies
export default (container, config) => {
  const app = Router()

  app.post("/create-shipment/:order_id/:fulfillment_id", async (req, res) => {
    const orderService = req.scope.resolve("orderService")
    const eventBus = req.scope.resolve("eventBusService")
    const order = await orderService.retrieve(req.params.order_id)

    await orderService.createShipment(order._id, req.params.fulfillment_id, [
      "1234",
    ])

    res.sendStatus(200)
  })

  app.post("/run-hook/:order_id/refund", async (req, res) => {
    const orderService = req.scope.resolve("orderService")
    const eventBus = req.scope.resolve("eventBusService")
    const order = await orderService.retrieve(req.params.order_id)
    const returnToSend = order.refunds[order.refunds.length - 1]

    eventBus.emit("order.refund_created", {
      order,
      refund: returnToSend,
    })

    res.sendStatus(200)
  })

  app.post("/run-hook/:order_id/return", async (req, res) => {
    const orderService = req.scope.resolve("orderService")
    const eventBus = req.scope.resolve("eventBusService")
    const order = await orderService.retrieve(req.params.order_id)
    const returnToSend = order.returns[0]

    eventBus.emit("order.items_returned", {
      order,
      return: {
        ...returnToSend,
        refund_amount: 1000,
      },
    })

    res.sendStatus(200)
  })

  app.post("/run-hook/:order_id/capture", async (req, res) => {
    const orderService = req.scope.resolve("orderService")
    const eventBus = req.scope.resolve("eventBusService")
    const order = await orderService.retrieve(req.params.order_id)

    eventBus.emit("order.payment_captured", order)

    res.sendStatus(200)
  })

  app.post("/run-hook/:order_id", async (req, res) => {
    const orderService = req.scope.resolve("orderService")
    const eventBus = req.scope.resolve("eventBusService")
    const order = await orderService.retrieve(req.params.order_id)

    eventBus.emit("order.placed", order)

    res.sendStatus(200)
  })

  admin(app, container, config)
  store(app, container, config)

  app.use(errorHandler())

  return app
}
