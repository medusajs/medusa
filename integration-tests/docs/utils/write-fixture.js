const fs = require("fs").promises
const path = require("path")

class FixtureWriter {
  constructor() {
    const fixPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "docs",
      "api",
      "fixtures.json"
    )
    const resolvedPath = path.resolve(fixPath)
    const existing = require(resolvedPath)

    this.toWrite_ = {}
    this.resolvedPath_ = resolvedPath
  }

  addFixture(key, data) {
    const [namespace, id] = key.split(".")

    this.toWrite_ = {
      ...this.toWrite_,
      [namespace]: {
        ...(this.toWrite_[namespace] || {}),
        [id]: data,
      },
    }
  }

  async execute() {
    const apiDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "docs",
      "api",
      "fixtures"
    )

    for (const [namespace, fixData] of Object.entries(this.toWrite_)) {
      const nsDir = path.join(apiDir, namespace)
      for (const [id, data] of Object.entries(fixData)) {
        const fixDir = path.join(nsDir, `${id}.json`)
        const resolved = path.resolve(fixDir)
        const s = JSON.stringify(data, null, 2)
        await fs.writeFile(resolved, s)
      }
    }
  }
}

const instance = new FixtureWriter()
export default instance
