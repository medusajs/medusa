const dbFactory = require("./helpers/use-template-db")

module.exports = async () => {
  await dbFactory.destroy()
}
