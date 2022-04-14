const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const workerId = parseInt(process.env.JEST_WORKER_ID || "1")

module.exports = {
  plugins: [],
  projectConfig: {
    // redis_url: REDIS_URL,
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost/medusa-integration-${workerId}`,
    database_type: "postgres",
    jwt_secret: 'test',
    cookie_secret: 'test'
  },
}
