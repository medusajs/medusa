import { workflowEngineTestSuite } from "./tests"

jest.setTimeout(5000000)

const env = {
  MEDUSA_FF_MEDUSA_V2: false,
}

workflowEngineTestSuite(env, { force_modules_migration: true })
