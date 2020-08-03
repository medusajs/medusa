import { Router } from "express"
import bodyParser from "body-parser"

export default (container) => {
  const app = Router()

  app.post("/brightpearl/inventory-update", bodyParser.json(), async (req, res) => {
    const { id } = req.body
    const brightpearlService = req.scope.resolve("brightpearlService")
    await brightpearlService.updateInventory(id)
    res.sendStatus(200)
  })

  return app
}
