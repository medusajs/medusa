import { MedusaError } from "medusa-core-utils"

import { registeredOverrides } from '../utils'

type CoreImport = { [key: string]: any }

export default async ({ isTest = false } = {}) => {
  for (let [key, override] of registeredOverrides) {
    const distributionPath = isTest ? "../" : "@medusajs/medusa/dist/"
    const corePath = `${distributionPath}${key}`
    let coreImport: CoreImport = {}

    try {
      coreImport = (await import(corePath))
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Override Registration Error: "${corePath}" not found for registration key "${key}"`
      )
    }

    Object.entries(override).forEach(([overrideKey, overrideValue]) => {
      if (coreImport[overrideKey]) {
        if (Array.isArray(coreImport[overrideKey])) {
          coreImport[overrideKey] = coreImport[overrideKey].concat(overrideValue)
        } else {
          coreImport[overrideKey] = overrideValue
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Override Registration Error: "${overrideKey}" not found in "${corePath}" for registration key "${key}"`
        )
      }
    })
  }
}
