import {
  IPricingModuleService,
  IProductModuleService,
  MoneyAmountDTO,
  PriceListDTO,
  ProductVariantDTO,
} from "@medusajs/types"
import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { MedusaError } from "medusa-core-utils"
import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."
import { PriceList } from "../../../.."
import { CustomerGroupService } from "../../../../services"
import PriceListService from "../../../../services/price-list"
import { defaultAdminProductRemoteQueryObject } from "../products"

type PriceListPriceCoreDTO = MoneyAmountDTO & {
  region_id?: string | null
  variant_id?: string | null
  variant?: ProductVariantDTO | null
  variants?: ProductVariantDTO[]
  price_list_id?: string | null
}

type PriceListCoreDTO = PriceListDTO & {
  name?: string
  prices?: PriceListPriceCoreDTO[]
  customer_groups?: any[]
}
/**
 * @oas [get] /admin/price-lists/{id}
 * operationId: "GetPriceListsPriceList"
 * summary: "Get a Price List"
 * description: "Retrieve a Price List's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.retrieve(priceListId)
 *       .then(({ price_list }) => {
 *         console.log(price_list.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/price-lists/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Price Lists
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  let priceList

  if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    const [priceLists, _] = await listAndCountPriceListPricingModule({ req })
    priceList = priceLists[0]
  } else {
    priceList = await priceListService.retrieve(id, {
      select: defaultAdminPriceListFields as (keyof PriceList)[],
      relations: defaultAdminPriceListRelations,
    })
  }

  res.status(200).json({ price_list: priceList })
}

export async function listAndCountPriceListPricingModule({
  req,
  list = false,
}) {
  const { id } = req.params

  const remoteQuery = req.scope.resolve("remoteQuery")
  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )
  const pricingModuleService: IPricingModuleService = req.scope.resolve(
    "pricingModuleService"
  )
  const productModuleService: IProductModuleService = req.scope.resolve(
    "productModuleService"
  )

  const filter = id ? { id } : {}

  const [priceLists, count]: [PriceListCoreDTO[], number] =
    await pricingModuleService.listAndCountPriceLists(filter, {
      select: defaultAdminPriceListSelectsPricingModule,
      relations: defaultAdminPriceListRelationsPricingModule,
    })

  const priceSetIds = priceLists
    .map((pl) => pl.price_set_money_amounts?.map((psma) => psma?.price_set?.id))
    .flat()

  const query = {
    product_variant_price_set: {
      __args: {
        price_set_id: priceSetIds,
      },
      fields: ["variant_id", "price_set_id"],
    },
  }

  const variantPriceSets = await remoteQuery(query)
  const variantIds = variantPriceSets.map((vps) => vps.variant_id)

  const productVariants = await productModuleService.listVariants(
    {
      id: variantIds,
    },
    {
      select: defaultAdminProductRemoteQueryObject.variants.fields,
    }
  )

  const variantsMap: Map<string, ProductVariantDTO> = new Map(
    productVariants.map((productVariant) => [productVariant.id, productVariant])
  )
  const variantIdToPriceSetIdMap: Map<string, ProductVariantDTO> = new Map()

  for (const { variant_id, price_set_id } of variantPriceSets) {
    const productVariant = variantsMap.get(variant_id)

    if (productVariant) {
      variantIdToPriceSetIdMap.set(price_set_id, productVariant)
    }
  }

  for (const priceList of priceLists) {
    const priceSetMoneyAmounts = priceList.price_set_money_amounts || []
    const priceListRulesData = priceList.price_list_rules || []
    delete priceList.price_set_money_amounts
    delete priceList.price_list_rules

    const priceListRuleIds = priceListRulesData.map((plr) => plr.id)
    const priceListPrices: PriceListPriceCoreDTO[] = []

    const priceListRules = await pricingModuleService.listPriceListRules(
      {
        id: priceListRuleIds,
      },
      { relations: ["rule_type", "price_list_rule_values"] }
    )

    const customerGroupPriceListRule = priceListRules.find(
      (plr) => plr.rule_type?.rule_attribute === "customer_group_id"
    )

    for (const priceSetMoneyAmount of priceSetMoneyAmounts) {
      const priceSetId = priceSetMoneyAmount?.price_set?.id
      const productVariant = variantIdToPriceSetIdMap.get(priceSetId as string)

      const price: PriceListPriceCoreDTO = {
        ...(priceSetMoneyAmount.money_amount as MoneyAmountDTO),
        price_list_id: priceList.id,
      }

      // TODO: do something about region id
      price.region_id = null

      if (productVariant) {
        // TODO: We have these 3 versions of variants in the response
        // Remove 2 of them if its not needed
        price.variant_id = productVariant.id
        price.variant = productVariant
        price.variants = [productVariant]
      } else {
        price.variant_id = null
        price.variant = null
        price.variants = []
      }

      priceListPrices.push(price)
    }

    priceList.prices = priceListPrices
    priceList.name = priceList.title
    priceList.customer_groups = []

    if (customerGroupPriceListRule) {
      const customerGroupIds =
        customerGroupPriceListRule?.price_list_rule_values?.map(
          (plrv) => plrv.value
        ) || []

      const customerGroups = await customerGroupService.list(
        { id: customerGroupIds },
        {}
      )

      priceList.customer_groups = customerGroups
    }

    delete priceList.title
  }

  if (!list && count === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Price list with id: ${id} was not found`
    )
  }

  return [priceLists, count]
}

const defaultAdminPriceListRelationsPricingModule = [
  "price_list_rules",
  "price_set_money_amounts",
  "price_set_money_amounts.money_amount",
  "price_set_money_amounts.price_set",
]

const defaultAdminPriceListSelectsPricingModule = [
  "created_at",
  "deleted_at",
  "description",
  "ends_at",
  "id",
  "title",
  "starts_at",
  "status",
  "type",
  "updated_at",
  "price_set_money_amounts.id",
  "price_set_money_amounts.price_set.id",
  "price_set_money_amounts.money_amount.id",
  "price_set_money_amounts.money_amount.id",
  "price_set_money_amounts.money_amount.currency_code",
  "price_set_money_amounts.money_amount.amount",
  "price_set_money_amounts.money_amount.min_quantity",
  "price_set_money_amounts.money_amount.max_quantity",
  "price_set_money_amounts.money_amount.created_at",
  "price_set_money_amounts.money_amount.deleted_at",
  "price_set_money_amounts.money_amount.updated_at",
]
