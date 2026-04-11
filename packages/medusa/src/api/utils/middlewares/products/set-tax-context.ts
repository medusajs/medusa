import { TaxCalculationContext } from "@medusajs/framework/types"
import { NextFunction } from "express"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  refetchEntity,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { StoreRequestWithContext } from "../../../store/types"
import { DEFAULT_PRICE_FIELD_PATHS } from "./constants"

type TaxContextOptions = {
  priceFieldPaths?: string[]
}

export function setTaxContext(options: TaxContextOptions = {}) {
  const { priceFieldPaths = DEFAULT_PRICE_FIELD_PATHS } = options

  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const withCalculatedPrice = req.queryConfig.fields.some((field) =>
      priceFieldPaths.some(
        (pricePath) => field === pricePath || field.startsWith(`${pricePath}.`)
      )
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
      ;(req as unknown as StoreRequestWithContext<any>).taxContext = {
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
  const region = await refetchEntity({
    entity: "region",
    idOrFilter: req.filterableFields.region_id as string,
    scope: req.scope,
    fields: ["automatic_taxes"],
  })

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Region with id ${req.filterableFields.region_id} not found when populating the tax context`
    )
  }

  return {
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
    locale: req.locale,
  } as TaxCalculationContext

  return taxContext
}
