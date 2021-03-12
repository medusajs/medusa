const fs = require("fs").promises;
const path = require("path");

class FixtureWriter {
  constructor() {
    const resolvedPath = path.resolve("./docs/api/fixtures.json");
    const existing = require(resolvedPath);

    this.toWrite_ = existing.resources;
    this.resolvedPath_ = resolvedPath;
  }

  addFixture(key, data) {
    this.toWrite_ = {
      ...this.toWrite_,
      [key]: data,
    };
  }

  async execute() {
    const toSet = {
      resources: this.toWrite_,
    };
    const s = JSON.stringify(toSet, null, 2);
    return await fs.writeFile(this.resolvedPath_, s);
  }
}

const instance = new FixtureWriter();
export default instance;
