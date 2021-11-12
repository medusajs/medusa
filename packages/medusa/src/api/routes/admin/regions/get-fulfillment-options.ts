import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import FulfillmentProviderService from "../../../../services/fulfillment-provider"
import { IsString } from "class-validator"

/**
 * @oas [get] /regions/{id}/fulfillment-options
 * operationId: "GetRegionsRegionFulfillmentOptions"
 * summary: "List Fulfillment Options available in the Region"
 * description: "Gathers all the fulfillment options available to in the Region."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             fulfillment_options:
 *               type: array
 *               items:
 *                 type: object
 */
export default async (req, res) => {
  const validated = await validator(
    AdminGetRegionsRegionFulfillmentOptionsParams,
    req.query
  )
  const { region_id } = validated

  const fulfillmentProviderService: FulfillmentProviderService =
    req.scope.resolve("fulfillmentProviderService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const region: Region = await regionService.retrieve(region_id, {
    relations: ["fulfillment_providers"],
  })

  const fpsIds = region.fulfillment_providers.map((fp) => fp.id) || []

  const options: FulfillmentOption[] =
    await fulfillmentProviderService.listFulfillmentOptions(fpsIds)

  res.status(200).json({
    fulfillment_options: options,
  })
}

export class AdminGetRegionsRegionFulfillmentOptionsParams {
  @IsString()
  region_id
}

export class FulfillmentOption {
  provider_id: string
  options: any[]
}

export class AdminGetRegionsRegionFulfillmentOptionsRes {
  fulfillment_options: FulfillmentOption[]
}
