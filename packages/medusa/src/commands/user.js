import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"

import loaders from "../loaders"

export default async function({ directory, id, email, password, keepAlive }) {
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

  if (!keepAlive) {
    process.exit()
  }
}
