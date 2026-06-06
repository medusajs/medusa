import { defineMiddlewares } from "@zjedene-medusa/framework"

export const errorHandlerMock = jest
  .fn()
  .mockImplementation((err, req, res, next) => {
    console.log("errorHandlerMock", err)
    return res.status(400).json({
      type: err.code.toLowerCase(),
      message: err.message,
    })
  })

export default defineMiddlewares({
  errorHandler: (err, req, res, next) => errorHandlerMock(err, req, res, next),
})
