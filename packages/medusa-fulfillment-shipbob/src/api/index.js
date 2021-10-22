import { Router } from "express"
import bodyParser from "body-parser"

export default () => {
  const app = Router()

  app.post(
    "/shipbob/shipments",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
      const eventBus = req.scope.resolve("eventBusService")

      eventBus.emit("shipbob.shipment", {
        headers: req.headers,
        body: JSON.parse(req.body),
      })

      res.sendStatus(200)
    }
  )

  return app
}
