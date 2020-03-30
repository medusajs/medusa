import { Router } from "express"

export default () => {
  const app = Router()

  app.get("/stripe", (req, res) => {
    console.log("hi")
    res.json({
      success: true
    })
  })

  return app
}
