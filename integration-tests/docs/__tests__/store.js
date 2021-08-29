const fixtureWriter = require("../utils/write-fixture").default
const { useApi } = require("../../helpers/use-api")
const { useDb } = require("../../helpers/use-db")

const cartTest = require("../test-input/store/cart")

const toTest = [cartTest]

jest.setTimeout(30000)

test.each(toTest)(
  "$operationId",
  async ({ setup, buildEndpoint, snapshotMatch, operationId }) => {
    const api = useApi()
    const db = useDb()

    const manager = db.connection.manager
    const id = await setup(manager, api)

    const response = await api.get(buildEndpoint(id)).catch((err) => {
      console.log(err)
    })

    expect(response.data).toMatchSnapshot(snapshotMatch)

    fixtureWriter.addFixture(`store.${operationId}`, response.data)
  }
)
