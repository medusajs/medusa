import { Request, Response, NextFunction } from "express"
import compression from "compression"
import { Logger } from "@medusajs/types"
import {
  ProjectConfigOptions,
  HttpCompressionOptions,
} from "@medusajs/types"

export function shouldCompressResponse(req: Request, res: Response) {
  const logger: Logger = req.scope.resolve("logger")
  const { projectConfig } = req.scope.resolve("configModule")
  const { enabled } = compressionOptions(projectConfig)

  if (!enabled) {
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
): HttpCompressionOptions {
  const responseCompressionOptions = config.http_compression ?? {}

  responseCompressionOptions.enabled = responseCompressionOptions.enabled ?? false
  responseCompressionOptions.level = responseCompressionOptions.level ?? 6
  responseCompressionOptions.memLevel = responseCompressionOptions.memLevel ?? 8
  responseCompressionOptions.threshold =
    responseCompressionOptions.threshold ?? 1024

  return responseCompressionOptions
}
