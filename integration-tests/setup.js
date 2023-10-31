const { useDb } = require("./environment-helpers/use-db")

afterAll(async () => {
  const db = useDb()
  await db.shutdown()
})
