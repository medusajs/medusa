import {
  createExtensionSql,
  LAKEBASE_EXTENSIONS,
  textSearchConfigName,
  wordSimilarityCall,
} from "../extensions"

describe("search extensions helpers", () => {
  it("builds the medusa text search config name", () => {
    expect(textSearchConfigName("english")).toBe("medusa_search_english")
  })

  it("builds word_similarity()", () => {
    expect(wordSimilarityCall("?", `"search_text"`)).toBe(
      `word_similarity(?, "search_text")`
    )
  })

  it("creates lakebase extensions by quoted name", () => {
    expect(LAKEBASE_EXTENSIONS).toEqual(["lakebase_text", "lakebase_vector"])
    expect(createExtensionSql("lakebase_text")).toBe(
      `CREATE EXTENSION IF NOT EXISTS "lakebase_text"`
    )
  })
})
