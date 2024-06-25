import * as process from "process"

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

interface TestDatabase {
  clearTables(knex): Promise<void>
}

export const TestDatabase: TestDatabase = {
  clearTables: async (knex) => {
    await knex.raw(`
      TRUNCATE TABLE workflow_execution CASCADE;
    `)

    await cleanRedis()
  },
}

async function deleteKeysByPattern(pattern) {
  const stream = redis.scanStream({
    match: pattern,
    count: 100,
  })

  for await (const keys of stream) {
    if (keys.length) {
      const pipeline = redis.pipeline()
      keys.forEach((key) => pipeline.del(key))
      await pipeline.exec()
    }
  }
}

async function cleanRedis() {
  try {
    await deleteKeysByPattern("bull:*")
    await deleteKeysByPattern("dtrx:*")
  } catch (error) {
    console.error("Error:", error)
  }
}
