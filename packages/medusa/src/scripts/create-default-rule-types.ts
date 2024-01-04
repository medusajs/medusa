import { createDefaultRuleTypes } from "./utils/create-default-rule-types"
import dotenv from "dotenv"
import express from "express"
import loaders from "../loaders"
import Logger from "../loaders/logger"

dotenv.config()

const migrate = async function ({ directory }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  return await createDefaultRuleTypes(container)
}

migrate({ directory: process.cwd() })
  .then(() => {
    Logger.log("Created default rule types")
    process.exit()
  })
  .catch(() => {
    Logger.log("Failed to create rule types")
    process.exit(1)
  })
