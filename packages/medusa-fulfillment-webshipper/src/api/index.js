import { Router } from "express"
import bodyParser from "body-parser"
import crypto from "crypto"
import cors from "cors"
import { getConfigFile, parseCorsOrigins } from "medusa-core-utils"

export default (rootDirectory) => {
  const app = Router()

  const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  const { projectConfig } = configModule

  const corsOptions = {
    origin: parseCorsOrigins(projectConfig.store_cors),
    credentials: true,
  }

  app.options("/webshipper/drop-points/:rate_id", cors(corsOptions))
  app.get(
    "/webshipper/drop-points/:rate_id",
    cors(corsOptions),
    async (req, res) => {
      const { rate_id } = req.params
      const { address_1, postal_code, country_code } = req.query

      try {
        const webshipperService = req.scope.resolve(
          "webshipperFulfillmentService"
        )

        const dropPoints = await webshipperService.retrieveDropPoints(
          rate_id,
          postal_code,
          country_code,
          address_1
        )

        res.json({
          drop_points: dropPoints,
        })
      } catch (err) {
        res.json({ drop_points: [] })
      }
    }
  )

  app.post(
    "/webshipper/shipments",
    bodyParser.raw({ type: "application/vnd.api+json" }),
    async (req, res) => {
      const webshipperService = req.scope.resolve(
        "webshipperFulfillmentService"
      )
      const eventBus = req.scope.resolve("eventBusService")
      const logger = req.scope.resolve("logger")

      const secret = webshipperService.options_.webhook_secret
      const hmac = crypto.createHmac("sha256", secret)
      const digest = hmac.update(req.body).digest("base64")
      const hash = req.header("x-webshipper-hmac-sha256")

      if (hash === digest) {
        eventBus.emit("webshipper.shipment", {
          headers: req.headers,
          body: JSON.parse(req.body),
        })
      } else {
        logger.warn("Webshipper webhook could not be authenticated")
      }

      res.sendStatus(200)
    }
  )

  return app
}
