import { workflowEngineTestSuite } from "./tests"

jest.setTimeout(5000000)

const env = {
  MEDUSA_FF_MEDUSA_V2: false,
  MEDUSA_FF_SALES_CHANNELS: true,
}

workflowEngineTestSuite(env, { force_modules_migration: true })
