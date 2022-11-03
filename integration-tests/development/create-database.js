const path = require("path")

require("dotenv").config({ path: path.join(__dirname, ".env.development") })

const { initDb } = require("./use-db-development")

require("./dev-require")

const seedDB = async (db) => {
  const seeder = require("./database/index.js")
  try {
    await seeder(db)
  } catch (err) {
    console.log("Error", err)
  }
}

const start = async () => {
  console.log("Creating DB...")
  const dbConnection = await initDb()
  console.log("Creating DB. DONE")

  console.log("Seeding DB...")
  await seedDB(dbConnection)
  console.log("Seeding DB... DONE")

  await dbConnection.close()
  process.exit()
}

start()
