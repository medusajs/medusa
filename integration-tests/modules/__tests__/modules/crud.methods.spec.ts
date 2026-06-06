import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, dbConnection, api, dbConfig }) => {
    let appContainer

    beforeAll(() => {
      appContainer = getContainer()
    })

    describe("auto-generated CRUD methods", () => {
      it("should create brands", async () => {
        const brandModule = appContainer.resolve("brand")

        const brand = await brandModule.createBrands({
          name: "Medusa Brand",
        })

        expect(brand).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Medusa Brand",
          })
        )

        const multipleBrands = await brandModule.createBrands([
          {
            name: "Medusa Brand 2",
          },
          {
            name: "Medusa Brand 3",
          },
        ])

        expect(multipleBrands).toEqual([
          expect.objectContaining({
            id: expect.stringMatching("brand_"),
            name: "Medusa Brand 2",
          }),
          expect.objectContaining({
            id: expect.stringMatching("brand_"),
            name: "Medusa Brand 3",
          }),
        ])
      })

      it("should update brands", async () => {
        const brandModule = appContainer.resolve("brand")

        const multipleBrands = await brandModule.createBrands([
          {
            name: "Medusa Brand 2",
          },
          {
            name: "Medusa Brand 3",
          },
        ])

        const brand = await brandModule.updateBrands({
          id: multipleBrands[0].id,
          name: "Medusa Brand",
        })

        expect(brand).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Medusa Brand",
          })
        )

        const multipleBrandsUpdated = await brandModule.updateBrands([
          {
            id: multipleBrands[0].id,
            name: "Medusa Brand 22",
          },
          {
            id: multipleBrands[1].id,
            name: "Medusa Brand 33",
          },
        ])

        expect(multipleBrandsUpdated).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: "Medusa Brand 22",
            }),
            expect.objectContaining({
              id: expect.any(String),
              name: "Medusa Brand 33",
            }),
          ])
        )

        const multipleBrandsUpdatedWithSelector =
          await brandModule.updateBrands({
            selector: {
              name: { $like: "Medusa Brand 22" },
            },
            data: {
              name: "Medusa Brand **",
            },
          })

        expect(multipleBrandsUpdatedWithSelector).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            name: "Medusa Brand **",
          }),
        ])
      })
    })
  },
})
