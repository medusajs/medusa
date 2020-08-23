import { Router } from "express"
import bodyParser from "body-parser"

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
    const brightpearlService = req.scope.resolve("brightpearlService")

    if (lifecycle_event === "created") {
      await brightpearlService.createFulfillmentFromGoodsOut(id)
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

  return app
}
