import { defineRoutesConfig } from "../../../../../utils/define-routes-config"

export default defineRoutesConfig({
  errorHandler: (err, _req, res, _next) => {
    const { code, message } = err

    switch (code) {
      case "NOT_ALLOWED":
        res.status(405).json({
          type: code.toLowerCase(),
          message,
        })
        break
      case "INVALID_DATA":
        res.status(400).json({
          type: code.toLowerCase(),
          message,
        })
        break
      case "CONFLICT":
        res.status(409).json({
          type: code.toLowerCase(),
          message,
        })
        break
      case "TEAPOT":
        res.status(418).json({
          type: code.toLowerCase(),
          message,
        })
        break
      default:
        res.status(500).json({
          type: "unknown_error",
          message: "An unknown error occurred.",
        })
    }
  },
})
