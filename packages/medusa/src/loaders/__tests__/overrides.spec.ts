import { MedusaError } from "medusa-core-utils"

import overridesLoader from "../overrides"
import { registerOverride } from '../../utils'

async function registrationHelper({ key, override }): Promise<MedusaError | null> {
  let error = null

  try {
    registerOverride({
      key,
      override
    })

    await overridesLoader({ isTest: true })
  } catch (e) {
    error = e
  }

  return error
}

describe("overridesLoader", () => {
  let error, key, override

  it("should not throw error when registered correctly", async () => {
    const error = await registrationHelper({
      key: 'api/routes/store/products/index',
      override: {
        defaultStoreProductsFields: ['custom_attribute'],
        allowedStoreProductsFields: ['custom_attribute'],
      }
    })

    expect(error).toBeFalsy()
  })

  it("should throw error when key does not point to an existing file", async () => {
    const error = await registrationHelper({
      key: 'api/incorrect-key',
      override: {
        defaultStoreProductsFields: ['custom_attribute'],
        allowedStoreProductsFields: ['custom_attribute'],
      }
    })

    expect(error?.message).toBe(
      'Override Registration Error: "../api/incorrect-key" not found for registration key "api/incorrect-key"'
    )
    expect(error).toBeTruthy()
  })

  it("should throw error when trying to override a value that does not exist", async () => {
    const error = await registrationHelper({
      key: 'api/routes/store/products/index',
      override: {
        doesnotexist: ['custom_attribute'],
      }
    })

    expect(error?.message).toBe(
      'Override Registration Error: "doesnotexist" not found in "../api/routes/store/products/index" for registration key "api/routes/store/products/index"'
    )
    expect(error).toBeTruthy()
  })
})
