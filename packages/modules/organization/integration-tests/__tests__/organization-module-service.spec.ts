import { IOrganizationModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { OrganizationModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { createOrganizationFixture, createBrandBuFixture } from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrganizationModuleService>({
  moduleName: Modules.ORGANIZATION,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.ORGANIZATION, {
        service: OrganizationModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["organization"])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.organization).toEqual({
        id: {
          linkable: "organization_id",
          entity: "Organization",
          primaryKey: "id",
          serviceName: "organization",
          field: "organization",
        },
      })
    })

    describe("Organization Module Service", () => {
      describe("creating organizations", () => {
        it("should create an organization successfully", async function () {
          const org = await service.createOrganizations(createOrganizationFixture)

          expect(org).toEqual(
            expect.objectContaining({
              name: "Main Operations",
              code: "OPS001",
              org_type: "operation",
              status: "active",
            })
          )
        })

        it("should create multiple organizations", async function () {
          const orgs = await service.createOrganizations([
            createOrganizationFixture,
            createBrandBuFixture,
          ])

          expect(orgs).toHaveLength(2)
          expect(orgs[0].org_type).toEqual("operation")
          expect(orgs[1].org_type).toEqual("brand_bu")
        })
      })

      describe("retrieving organizations", () => {
        it("should retrieve an organization by id", async function () {
          const created = await service.createOrganizations(createOrganizationFixture)
          const org = await service.retrieveOrganization(created.id)

          expect(org.id).toEqual(created.id)
          expect(org.code).toEqual("OPS001")
        })
      })

      describe("listing organizations", () => {
        it("should list all organizations", async function () {
          await service.createOrganizations([
            createOrganizationFixture,
            createBrandBuFixture,
          ])

          const orgs = await service.listOrganizations()
          expect(orgs).toHaveLength(2)
        })

        it("should list and count organizations", async function () {
          await service.createOrganizations([
            createOrganizationFixture,
            createBrandBuFixture,
          ])

          const [orgs, count] = await service.listAndCountOrganizations()
          expect(orgs).toHaveLength(2)
          expect(count).toEqual(2)
        })

        it("should filter by org_type", async function () {
          await service.createOrganizations([
            createOrganizationFixture,
            createBrandBuFixture,
          ])

          const orgs = await service.listOrganizations({ org_type: "brand_bu" })
          expect(orgs).toHaveLength(1)
          expect(orgs[0].name).toEqual("Brand BU")
        })
      })

      describe("updating organizations", () => {
        it("should update an organization name", async function () {
          const created = await service.createOrganizations(createOrganizationFixture)
          const updated = await service.updateOrganizations({
            id: created.id,
            name: "Updated Operations",
          })

          expect(updated.name).toEqual("Updated Operations")
          expect(updated.code).toEqual("OPS001")
        })
      })

      describe("deleting organizations", () => {
        it("should delete an organization", async function () {
          const created = await service.createOrganizations(createOrganizationFixture)
          await service.deleteOrganizations(created.id)

          const orgs = await service.listOrganizations()
          expect(orgs).toHaveLength(0)
        })
      })
    })
  },
})
