const { run } = require("./dist/scripts/seed")

;(async () => {
  await run({
    path: "./dist/scripts/seed-data/index.js",
    options: {
      defaultAdapterOptions: {
        database: {
          clientUrl:
            "postgres://postgres:postgres@localhost:5432/medusa-catalog",
        },
      },
    },
  })
})()
