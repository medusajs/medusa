import { Router } from "express"

export default () => {
  const app = Router()

  app.get("/project-root", async (req, res, next) => {
    try {
      const testService = req.scope.resolve("testService")
      const newHi = await testService.sayHi()
      res.status(200).json(newHi)
    } catch (e) {
      next(e)
    }
  })

  return app
}
