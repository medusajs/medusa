import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"

import loaders from "../loaders"

export default async function({ directory, id, email, password }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
  })

  const userService = container.resolve("userService")
  await userService.create({ id, email }, password)

  process.exit()
}
