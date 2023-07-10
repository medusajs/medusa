import { MedusaError } from "medusa-core-utils"
import { IsString } from "class-validator"

import overridesLoader from "../overrides"
import { registerOverride, resetOverride } from '../../utils'
import { validator } from '../../utils/validator'
import { AdminPostProductsReq } from "../../api/routes/admin/products/create-product"

class ExtendedAdminPostProductsReq extends AdminPostProductsReq {
  @IsString()
  custom_attribute: string
}

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

  beforeEach(() => {
    resetOverride()
  })

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

  it("should correctly register the overriden validator", async () => {
    let validationResult, error

    validationResult = await validator(AdminPostProductsReq, {
      title: "test",
    })

    const result = await registrationHelper({
      key: 'api/routes/admin/products/create-product',
      override: {
        AdminPostProductsReq: ExtendedAdminPostProductsReq,
      }
    })

    try {
      validationResult = await validator(AdminPostProductsReq, {
        title: "test",
      })
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error.message).toEqual("custom_attribute must be a string")

    validationResult = await validator(AdminPostProductsReq, {
      title: "test",
      custom_attribute: "test",
    })
  })

  it("should throw error when trying to register a validator that does not exist in core", async () => {
    const error = await registrationHelper({
      key: 'api/routes/admin/products/create-product',
      override: {
        ValidatorDoesnotExist: ExtendedAdminPostProductsReq,
      }
    })

    expect(error?.message).toBe(
      'Override Registration Error: "ValidatorDoesnotExist" not found in "../api/routes/admin/products/create-product" for registration key "api/routes/admin/products/create-product"'
    )
  })
})
