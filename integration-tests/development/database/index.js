const user = require("./user")
const region = require("./region")
const customer = require("./customer")

module.exports = async (db) => {
  await user(db)
  await region(db)
  await customer(db)
}
