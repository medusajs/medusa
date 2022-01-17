const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const workerId = parseInt(process.env.JEST_WORKER_ID || "1")

module.exports = {
  plugins: [
    {
      resolve: `medusa-fulfillment-webshipper`,
      options: {
        account: "test-account",
        api_token: "something",
        order_channel_id: "1",
        webhook_secret: "1234",
      },
    },
    {
      resolve: `medusa-plugin-sendgrid`,
      options: {
        api_key: "SG.TEST",
      },
    },
  ],
  projectConfig: {
    // redis_url: REDIS_URL,
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost/medusa-integration-${workerId}`,
    database_type: "postgres",
  },
}
