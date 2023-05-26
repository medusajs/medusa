import path from "path"

/**
 * Default shared dependencies that should be externalized.
 */
export const SHARED_DEPENDENCIES = [
  "@tanstack/react-query",
  "@tanstack/react-table",
  "@medusajs/medusa-js",
  "react-router-dom",
  "@remix-run/router",
  "medusa-react",
  "react",
]

export const ENV = process.env.NODE_ENV

export const SRC = path.resolve(process.cwd(), "src", "admin")

export const DIST = path.resolve(process.cwd(), "dist", "admin")
