import { Request, Response, NextFunction } from "express"
import compression from "compression"
import {
  ProjectConfigOptions,
  ResponseCompressionOptions,
} from "@medusajs/types"

export function shouldCompressResponse(req: Request, res: Response) {
  const {
    projectConfig: { response_compression_enabled },
  } = req.scope.resolve("configModule")

  if (response_compression_enabled !== true) {
    return false
  }

  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

export function compressionOptions(
  config: ProjectConfigOptions
): ResponseCompressionOptions {
  const responseCompressionOptions = config.response_compression_options ?? {}

  responseCompressionOptions.level = responseCompressionOptions.level ?? 6
  responseCompressionOptions.memLevel = responseCompressionOptions.memLevel ?? 8
  responseCompressionOptions.threshold =
    responseCompressionOptions.threshold ?? 1024

  return responseCompressionOptions
}
