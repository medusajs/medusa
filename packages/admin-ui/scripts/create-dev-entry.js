const fse = require("fs-extra")
const path = require("path")

function createDevEntryFile() {
  const devEntryContent = `
    const extensions = []

    export default extensions
  `

  const devEntryPath = path.resolve(
    __dirname,
    "..",
    "ui",
    "src",
    "extensions",
    "_main-entry.ts"
  )

  fse.outputFileSync(devEntryPath, devEntryContent)
}

createDevEntryFile()
