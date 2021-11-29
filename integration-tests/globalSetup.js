const templateDb = require("./helpers/useTemplateDb")

module.exports = async () => {
  console.log("setup")
  await templateDb.createDb_()
}
