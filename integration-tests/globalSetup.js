const dbFactory = require("./helpers/use-template-db")
const path = require("path")

module.exports = async () => {
  await dbFactory.createTemplateDb_({ cwd: path.resolve(".") })
}
