import {
  DB_TROUBLESHOOTING_URL,
  DBTroubleshootingSection,
  withDbTroubleshootingLink,
} from "../db-troubleshooting"

describe("withDbTroubleshootingLink", () => {
  it("appends the troubleshooting guide link to the message", () => {
    const result = withDbTroubleshootingLink("Something went wrong")

    expect(result).toContain("Something went wrong")
    expect(result).toContain(
      `See ${DB_TROUBLESHOOTING_URL} for troubleshooting steps.`
    )
  })

  it("links to a specific section when provided", () => {
    const result = withDbTroubleshootingLink(
      "Migration failed",
      DBTroubleshootingSection.MIGRATIONS
    )

    expect(result).toContain(
      `${DB_TROUBLESHOOTING_URL}#${DBTroubleshootingSection.MIGRATIONS}`
    )
  })
})
