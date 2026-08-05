import { MedusaModule } from "@medusajs/modules-sdk"
import { join } from "path"
import { SearchIndexLoader } from "../search-index-loader"

describe("SearchIndexLoader", () => {
  const rootDir = join(__dirname, "../__fixtures__", "search")

  beforeEach(() => {
    MedusaModule.clearInstances()
  })

  it("should skip a source path that does not exist", async () => {
    await new SearchIndexLoader(join(rootDir, "does-not-exist")).load()

    expect(MedusaModule.getSearchIndexes()).toEqual([])
  })

  it("should register each definition in the '/search' folder and sub folder", async () => {
    await new SearchIndexLoader(rootDir).load()

    expect(
      MedusaModule.getSearchIndexes()
        .map((index) => index.name)
        .sort()
    ).toEqual(["customer", "product"])
  })

  // A file is free to declare more than one index. Its own fixture folder because
  // a second load of an already imported file registers nothing.
  it("should register every definition when one file declares several", async () => {
    await new SearchIndexLoader(
      join(__dirname, "../__fixtures__", "multiple-per-file")
    ).load()

    expect(
      MedusaModule.getSearchIndexes()
        .map((index) => index.name)
        .sort()
    ).toEqual(["order", "return"])
  })
})
