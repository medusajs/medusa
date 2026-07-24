import {
  defineRoleSources,
  getRoleSources,
  ResolvedRole,
  RoleSources,
} from "../define-role-sources"

describe("defineRoleSources", function () {
  afterEach(function () {
    for (const key of Object.keys(RoleSources)) {
      delete RoleSources[key]
    }
  })

  it("should return the default source when nothing is registered", function () {
    expect(getRoleSources("user")).toEqual([{ reference: "user" }])
  })

  it("should register a single source normalized to an array", function () {
    defineRoleSources("user", { reference: "user" })

    expect(getRoleSources("user")).toEqual([{ reference: "user" }])
  })

  it("should register an array of declarative sources", function () {
    const sources = [
      { reference: "end_user" },
      {
        reference: "membership",
        path: "organization.memberships",
        scope: { type: "organization", path: "organization.id" },
      },
    ]

    defineRoleSources("end_user", sources)

    expect(getRoleSources("end_user")).toEqual(sources)
  })

  it("should replace, not merge, on re-registration", function () {
    defineRoleSources("end_user", [{ reference: "end_user" }])
    defineRoleSources("end_user", [
      { reference: "membership", path: "organization.memberships" },
    ])

    expect(getRoleSources("end_user")).toEqual([
      { reference: "membership", path: "organization.memberships" },
    ])
  })

  it("should accept a function source", function () {
    const resolve = async (): Promise<ResolvedRole[]> => []

    defineRoleSources("machine_client", { resolve })

    expect(getRoleSources("machine_client")).toEqual([{ resolve }])
  })

  it("should throw when actorType is empty", function () {
    expect(() => defineRoleSources("", { reference: "user" })).toThrow(
      "Role source definition must include a non-empty actorType"
    )
  })

  it("should throw when no sources are provided", function () {
    expect(() => defineRoleSources("user", [])).toThrow(
      "must include at least one source"
    )
  })

  it("should throw when a declarative source has an empty reference", function () {
    expect(() => defineRoleSources("user", [{ reference: "" }])).toThrow(
      "must include a non-empty"
    )
  })
})
