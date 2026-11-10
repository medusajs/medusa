import { IndexMetadataStatus } from "@utils"
import { createIndexTestBed, IndexModuleTestBed, schema } from "../__fixtures__"

jest.mock("../../src/utils/gql-to-types", () => ({
  gqlSchemaToTypes: jest
    .fn()
    .mockRejectedValue(
      Object.assign(
        new Error(
          "ENOENT: no such file or directory, open '.medusa/types/index-service-entry-points.d.ts'"
        ),
        { code: "ENOENT" }
      )
    ),
}))

jest.setTimeout(300000)

describe("IndexModuleService types generation", function () {
  let testBed: IndexModuleTestBed

  afterEach(async () => {
    await testBed?.teardown()
  })

  it("should still sync the index data when the types generation fails", async () => {
    testBed = await createIndexTestBed({ schema })

    const info = await testBed.module.getInfo()

    expect(info).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: "Product",
          status: IndexMetadataStatus.DONE,
        }),
        expect.objectContaining({
          entity: "ProductVariant",
          status: IndexMetadataStatus.DONE,
        }),
        expect.objectContaining({
          entity: "Price",
          status: IndexMetadataStatus.DONE,
        }),
      ])
    )

    expect(testBed.logger.logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "warn",
          args: [
            expect.stringContaining(
              "[Index engine] Failed to generate the index entry points types"
            ),
          ],
        }),
      ])
    )
  })
})
