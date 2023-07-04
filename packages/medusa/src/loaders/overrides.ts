import { MedusaError } from "medusa-core-utils"

import { registeredOverrides } from '../utils'

export default async ({ isTest = false }) => {
  for (let [key, override] of registeredOverrides) {
    const distributionPath = isTest ? "../" : "@medusajs/medusa/dist/"
    const corePath = `${distributionPath}${key}`
    let coreImport = ''

    try {
      coreImport = (await import(corePath)) as any
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Override Registration Error: "${corePath}" not found for registration key "${key}"`
      )
    }

    Object.entries(override).forEach(([overrideKey, overrideValue]) => {
      if (coreImport[overrideKey]) {
        coreImport[overrideKey] = coreImport[overrideKey].concat(overrideValue)
      } else {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Override Registration Error: "${overrideKey}" not found in "${corePath}" for registration key "${key}"`
        )
      }
    })
  }
}
