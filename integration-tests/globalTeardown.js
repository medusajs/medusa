const dbFactory = require("./environment-helpers/use-template-db")

module.exports = async () => {
  await dbFactory.destroy()
}
