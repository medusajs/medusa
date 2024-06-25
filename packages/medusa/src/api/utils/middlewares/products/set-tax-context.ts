import { TaxCalculationContext } from "@medusajs/types"
import { NextFunction } from "express"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
} from "../../../../types/routing"
import { refetchEntity } from "../../refetch-entity"
import { MedusaError } from "@medusajs/utils"
import { RequestWithContext } from "../../../store/products/helpers"

export function setTaxContext() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const withCalculatedPrice = req.remoteQueryConfig.fields.some((field) =>
      field.startsWith("variants.calculated_price")
    )
    if (!withCalculatedPrice) {
      return next()
    }

    try {
      const inclusivity = await getTaxInclusivityInfo(req)
      if (!inclusivity || !inclusivity.automaticTaxes) {
        return next()
      }

      const taxLinesContext = await getTaxLinesContext(req)

      // TODO: Allow passing a context typings param to AuthenticatedMedusaRequest
      ;(req as unknown as RequestWithContext<any>).taxContext = {
        taxLineContext: taxLinesContext,
        taxInclusivityContext: inclusivity,
      }
      return next()
    } catch (e) {
      next(e)
    }
  }
}

const getTaxInclusivityInfo = async (req: MedusaRequest) => {
  const region = await refetchEntity(
    "region",
    req.filterableFields.region_id as string,
    req.scope,
    ["automatic_taxes"]
  )

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Region with id ${req.filterableFields.region_id} not found when populating the tax context`
    )
  }

  // TODO: Add is_tax_inclusive here from pricing module
  return {
    isTaxInclusive: true,
    automaticTaxes: region.automatic_taxes,
  }
}

const getTaxLinesContext = async (req: MedusaRequest) => {
  if (!req.filterableFields.country_code) {
    return
  }

  const taxContext = {
    address: {
      country_code: req.filterableFields.country_code as string,
      province_code: req.filterableFields.province as string,
    },
  } as TaxCalculationContext

  return taxContext
}
