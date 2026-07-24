import { collectRoleReferences } from "../resolve-role-references"

describe("collectRoleReferences", () => {
  describe("without a scope", () => {
    it("collects reference ids across a single to-many relation", () => {
      const root = {
        organization: {
          memberships: [{ id: "mem_1" }, { id: "mem_2" }],
        },
      }

      expect(
        collectRoleReferences(root, "organization.memberships.id")
      ).toEqual([{ reference_id: "mem_1" }, { reference_id: "mem_2" }])
    })

    it("flattens to-many relations at multiple levels", () => {
      const root = {
        organizations: [
          { memberships: [{ id: "mem_1" }, { id: "mem_2" }] },
          { memberships: [{ id: "mem_3" }] },
        ],
      }

      expect(
        collectRoleReferences(root, "organizations.memberships.id")
      ).toEqual([
        { reference_id: "mem_1" },
        { reference_id: "mem_2" },
        { reference_id: "mem_3" },
      ])
    })

    it("returns an empty array when the path is broken", () => {
      expect(
        collectRoleReferences(
          { organization: null },
          "organization.memberships.id"
        )
      ).toEqual([])
      expect(collectRoleReferences({}, "organization.memberships.id")).toEqual(
        []
      )
    })

    it("skips null/missing intermediates within an array branch", () => {
      const root = {
        organizations: [
          { memberships: null },
          { memberships: [{ id: "mem_1" }, { id: "mem_2" }] },
          {},
        ],
      }

      expect(
        collectRoleReferences(root, "organizations.memberships.id")
      ).toEqual([{ reference_id: "mem_1" }, { reference_id: "mem_2" }])
    })
  })

  describe("with a shared-prefix scope", () => {
    it("associates each reference with the scope id of its branch node", () => {
      const root = {
        organizations: [
          {
            id: "org_1",
            memberships: [{ id: "mem_1" }, { id: "mem_2" }],
          },
          {
            id: "org_2",
            memberships: [{ id: "mem_3" }],
          },
        ],
      }

      expect(
        collectRoleReferences(
          root,
          "organizations.memberships.id",
          "organizations.id"
        )
      ).toEqual([
        { reference_id: "mem_1", scope_id: "org_1" },
        { reference_id: "mem_2", scope_id: "org_1" },
        { reference_id: "mem_3", scope_id: "org_2" },
      ])
    })

    it("handles a scope path equal to the reference path (self-scoping)", () => {
      const root = {
        organization: {
          memberships: [{ id: "mem_1" }, { id: "mem_2" }],
        },
      }

      expect(
        collectRoleReferences(
          root,
          "organization.memberships.id",
          "organization.memberships.id"
        )
      ).toEqual([
        { reference_id: "mem_1", scope_id: "mem_1" },
        { reference_id: "mem_2", scope_id: "mem_2" },
      ])
    })

    it("throws INVALID_DATA when a single branch yields multiple scope values", () => {
      const root = {
        organizations: [
          {
            tenants: [{ id: "ten_1" }, { id: "ten_2" }],
            memberships: [{ id: "mem_1" }],
          },
        ],
      }

      expect(() =>
        collectRoleReferences(
          root,
          "organizations.memberships.id",
          "organizations.tenants.id"
        )
      ).toThrow(/multiple values within a single branch/)
    })
  })

  describe("with a non-shared-prefix scope", () => {
    it("throws INVALID_DATA when the scope path shares no prefix with the path", () => {
      const root = {
        tenant: { id: "ten_1" },
        memberships: [{ id: "mem_1" }, { id: "mem_2" }],
      }

      expect(() =>
        collectRoleReferences(root, "memberships.id", "tenant.id")
      ).toThrow(/must share a leading prefix/)
    })
  })
})
