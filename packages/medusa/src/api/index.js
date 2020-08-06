import { Router } from "express"
import admin from "./routes/admin"
import store from "./routes/store"
import errorHandler from "./middlewares/error-handler"

// guaranteed to get dependencies
export default (container, config) => {
  const app = Router()

  app.post("/create-shipment/:order_id", async (req, res) => {
    const orderService = req.scope.resolve("orderService")
    const eventBus = req.scope.resolve("eventBusService")
    const order = await orderService.retrieve(req.params.order_id)

    await orderService.createShipment(order._id, {
      item_ids: order.items.map(({ _id }) => `${_id}`),
      tracking_number: "1234",
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
