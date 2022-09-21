import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { track } from "medusa-telemetry"

import loaders from "../loaders"

export default async function ({ directory, id, email, password, keepAlive }) {
  track("CLI_USER", { with_id: !!id })
  const app = express()
  try {
    const { container } = await loaders({
      directory,
      expressApp: app,
    })

    const userService = container.resolve("userService")
    await userService.create({ id, email }, password)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  track("CLI_USER_COMPLETED", { with_id: !!id })

  if (!keepAlive) {
    process.exit()
  }
}
