import { Router } from "express"
import bodyParser from "body-parser"

const BP_SECRET_TOKEN = process.env.BP_SECRET_TOKEN || ""

export default (container) => {
  const app = Router()

  app.post("/brightpearl/product", bodyParser.json(), async (req, res) => {
    const { id, lifecycle_event } = req.body

    if (lifecycle_event === "created") {
      const eventBus = req.scope.resolve("eventBusService")
      const brightpearlService = req.scope.resolve("brightpearlService")
      const bpProduct = await brightpearlService.retrieveProduct(id)

      eventBus.emit("brightpearl-product.created", bpProduct)
    }

    res.sendStatus(200)
  })

  app.post("/brightpearl/goods-out", bodyParser.json(), async (req, res) => {
    const { id, lifecycle_event } = req.body
    const eventBusService = req.scope.resolve("eventBusService")

    if (lifecycle_event === "created") {
      eventBusService.emit("brightpearl.goods_out_note", { id })
    }

    res.sendStatus(200)
  })

  app.post(
    "/brightpearl/inventory-update",
    bodyParser.json(),
    async (req, res) => {
      const { id } = req.body
      const brightpearlService = req.scope.resolve("brightpearlService")
      await brightpearlService.updateInventory(id)
      res.sendStatus(200)
    }
  )

  app.post("/brightpearl/orders/:id", async (req, res) => {
    const { access_token } = req.query
    const { id } = req.params

    if (
      !access_token ||
      !id ||
      !BP_SECRET_TOKEN ||
      access_token !== BP_SECRET_TOKEN
    ) {
      res.sendStatus(401)
      return
    }

    const brightpearlService = req.scope.resolve("brightpearlService")
    const orderService = req.scope.resolve("orderService")

    try {
      const order = await orderService.retrieve(id)
      if (order.metadata && order.metadata.brightpearl_sales_order_id) {
        throw new Error("Already sent to BP")
      }

      await brightpearlService.createSalesOrder(order.id)
      res.sendStatus(200)
    } catch (err) {
      res.status(400).json(err)
    }
  })

  return app
}
