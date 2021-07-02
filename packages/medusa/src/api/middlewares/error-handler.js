import { MedusaError } from "medusa-core-utils"

export default () => {
  return (err, req, res, next) => {
    const logger = req.scope.resolve("logger")
    logger.error(err.message)

    console.error(err)

    let statusCode = 500
    switch (err.name) {
      case MedusaError.Types.DUPLICATE_ERROR:
        statusCode = 409
        break
      case MedusaError.Types.NOT_ALLOWED:
      case MedusaError.Types.INVALID_DATA:
        statusCode = 400
        break
      case MedusaError.Types.NOT_FOUND:
        statusCode = 404
        break
      case MedusaError.Types.DB_ERROR:
        statusCode = 500
        break
      default:
        break
    }

    res.status(statusCode).json({
      name: err.name,
      message: err.message,
    })
  }
}
