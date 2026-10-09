import { DistributedTransaction } from "@medusajs/framework/orchestration"
import * as process from "process"
import { ulid } from "ulid"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

export const DB_URL = `postgres://${DB_USERNAME}${
  DB_PASSWORD ? `:${DB_PASSWORD}` : ""
}@${DB_HOST}/${DB_NAME}`

const Redis = require("ioredis")

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"
const redis = new Redis(redisUrl)

// Every spec in this suite shares a single Redis instance, and jest runs them
// on parallel workers. Each process therefore namespaces every key it writes,
// so that clearing its own state cannot touch another worker's in-flight
// transactions.
const workerId = process.env.JEST_WORKER_ID ?? "1"

// REF:https://stackoverflow.com/questions/78028715/jest-async-test-with-event-emitter-isnt-ending
const testRunId = ulid()

export const queueName = `medusa-workflows-${workerId}-${testRunId}`
export const jobQueueName = `medusa-workflows-jobs-${workerId}-${testRunId}`
export const transactionKeyPrefix = `dtrx-${workerId}-${testRunId}`

// Checkpoint keys are built from this static prefix, which defaults to the
// shared "dtrx". Claim a per-process namespace before any transaction runs.
DistributedTransaction.keyPrefix = transactionKeyPrefix

interface TestDatabase {
  clearTables(): Promise<void>
}

export const TestDatabase: TestDatabase = {
  clearTables: async () => {
    await cleanRedis()
  },
}

async function deleteKeysByPattern(pattern) {
  const stream = redis.scanStream({
    match: pattern,
    count: 100,
  })

  const pipeline = redis.pipeline()
  for await (const keys of stream) {
    if (keys.length) {
      keys.forEach((key) => pipeline.unlink(key))
    }
  }
  await pipeline.exec()
}

async function cleanRedis() {
  await deleteKeysByPattern(`bull:${queueName}:*`)
  await deleteKeysByPattern(`bull:${jobQueueName}:*`)
  await deleteKeysByPattern(`${transactionKeyPrefix}:*`)
}
