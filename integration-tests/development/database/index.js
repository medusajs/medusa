const user = require("./user")
const region = require("./region")

module.exports = async (db) => {
  await user(db)
  await region(db)
}
