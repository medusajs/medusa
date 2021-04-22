import "core-js/stable"
import "regenerator-runtime/runtime"

import mongoose from "mongoose"
import chokidar from "chokidar"
import express from "express"
import cwdResolve from "resolve-cwd"

import loaders from "../loaders"
import Logger from "../loaders/logger"

export default async function({ directory, id, email, password }) {
  const app = express()
  const { container, dbConnection } = await loaders({
    directory,
    expressApp: app,
  })

  const userService = container.resolve("userService")
  const user = await userService.create({ id, email }, password)

  process.exit()
}
