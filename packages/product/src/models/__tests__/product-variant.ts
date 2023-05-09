import { initialize } from '../../'
import { options } from '../../test-utils/config'

describe("ProductVariant Model", () => {
  let initializeResult

  beforeAll(async () => {
    console.log("start initializing()...")

    try {
      initializeResult = await initialize(options)
    } catch (err) {
      console.log("err - ", err)
    }

    console.log("end initializing()...")
  })

  afterAll(() => {
    console.log("TODO: cleanup")
  })

  it("write tests here", () => {
    console.log("TODO: write tests")
    console.log("initializeResult - ", initializeResult)
  })
})
