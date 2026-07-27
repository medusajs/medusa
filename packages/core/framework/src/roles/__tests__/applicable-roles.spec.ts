import { applicableRoles } from "../applicable-roles"

const unscopedRole = {
  role_id: "rol_global",
  source: { reference: "user", reference_id: "usr_1" },
}
const orgARole = {
  role_id: "rol_org_admin",
  source: { reference: "membership", reference_id: "mem_A" },
  scope: { type: "organization", id: "org_A" },
}
const orgBRole = {
  role_id: "rol_support",
  source: { reference: "membership", reference_id: "mem_B" },
  scope: { type: "organization", id: "org_B" },
}

const roles = [unscopedRole, orgARole, orgBRole]

describe("applicableRoles", () => {
  it("returns every role when no scope context is given", () => {
    expect(applicableRoles(roles)).toEqual(roles)
  })

  it("keeps only unscoped roles for an empty scope set", () => {
    expect(applicableRoles(roles, [])).toEqual([unscopedRole])
  })

  it("keeps unscoped roles plus those matching a single scope", () => {
    expect(
      applicableRoles(roles, { type: "organization", id: "org_A" })
    ).toEqual([unscopedRole, orgARole])
  })

  it("matches on both scope type and id", () => {
    expect(applicableRoles(roles, { type: "team", id: "org_A" })).toEqual([
      unscopedRole,
    ])
  })

  it("keeps roles matching any scope in the set", () => {
    expect(
      applicableRoles(roles, [
        { type: "organization", id: "org_A" },
        { type: "organization", id: "org_B" },
      ])
    ).toEqual(roles)
  })
})
