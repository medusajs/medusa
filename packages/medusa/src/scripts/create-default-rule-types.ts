import { createDefaultRuleTypes } from "./utils/create-default-rule-types"
import dotenv from "dotenv"
import express from "express"
import loaders from "../loaders"

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
    console.log("Created default rule types")
    process.exit()
  })
  .catch(() => {
    console.log("Failed to create rule types")
    process.exit(1)
  })
