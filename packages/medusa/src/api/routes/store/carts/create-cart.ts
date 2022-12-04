import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import reqIp from "request-ip"
import { Type } from "class-transformer"
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import {
  CartService,
  LineItemService,
  RegionService,
} from "../../../../services"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { Cart } from "../../../../models"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { FlagRouter } from "../../../../utils/flag-router"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { CartCreateProps } from "../../../../types/cart"
import { isDefined } from "../../../../utils"

/**
 * @oas [post] /carts
 * summary: "Create a Cart"
 * operationId: "PostCart"
 * description: "Creates a Cart within the given region and with the initial items. If no
 *   `region_id` is provided the cart will be associated with the first Region
 *   available. If no items are provided the cart will be empty after creation.
 *   If a user is logged in the cart's customer id and email will be set."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           region_id:
 *             type: string
 *             description: The ID of the Region to create the Cart in.
 *           sales_channel_id:
 *             type: string
 *             description: "[EXPERIMENTAL] The ID of the Sales channel to create the Cart in."
 *           country_code:
 *             type: string
 *             description: "The 2 character ISO country code to create the Cart in."
 *             externalDocs:
 *              url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *              description: See a list of codes.
 *           items:
 *             description: "An optional array of `variant_id`, `quantity` pairs to generate Line Items from."
 *             type: array
 *             items:
 *               required:
 *                 - variant_id
 *                 - quantity
 *               properties:
 *                 variant_id:
 *                   description: The id of the Product Variant to generate a Line Item from.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Product Variant to add
 *                   type: integer
 *           context:
 *             description: "An optional object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`"
 *             type: object
 *             example:
 *               ip: "::1"
 *               user_agent: "Chrome"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.create()
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/carts'
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: "Successfully created a new Cart"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const validated = req.validatedBody as StorePostCartReq

  const reqContext = {
    ip: reqIp.getClientIp(req),
    user_agent: req.get("user-agent"),
  }

  const lineItemService: LineItemService = req.scope.resolve("lineItemService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const entityManager: EntityManager = req.scope.resolve("manager")
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")

  let regionId!: string
  if (isDefined(validated.region_id)) {
    regionId = validated.region_id as string
  } else {
    const regions = await regionService.list({})

    if (!regions?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A region is required to create a cart`
      )
    }

    regionId = regions[0].id
  }

  const toCreate: Partial<CartCreateProps> = {
    region_id: regionId,
    sales_channel_id: validated.sales_channel_id,
    context: {
      ...reqContext,
      ...validated.context,
    },
  }

  if (req.user && req.user.customer_id) {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(req.user.customer_id)
    toCreate["customer_id"] = customer.id
    toCreate["email"] = customer.email
  }

  if (validated.country_code) {
    toCreate["shipping_address"] = {
      country_code: validated.country_code.toLowerCase(),
    }
  }

  let cart: Cart
  await entityManager.transaction(async (manager) => {
    cart = await cartService.withTransaction(manager).create(toCreate)

    if (validated.items) {
      await Promise.all(
        validated.items.map(async (i) => {
          const lineItem = await lineItemService
            .withTransaction(manager)
            .generate(i.variant_id, regionId, i.quantity, {
              customer_id: req.user?.customer_id,
            })
          return await cartService
            .withTransaction(manager)
            .addLineItem(cart.id, lineItem, {
              validateSalesChannels:
                featureFlagRouter.isFeatureEnabled("sales_channels"),
            })
        })
      )
    }
  })

  cart = await cartService.retrieveWithTotals(cart!.id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart })
}

export class Item {
  @IsNotEmpty()
  @IsString()
  variant_id: string

  @IsNotEmpty()
  @IsInt()
  quantity: number
}

export class StorePostCartReq {
  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsString()
  country_code?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items?: Item[]

  @IsOptional()
  context?: object

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
    IsString(),
    IsOptional(),
  ])
  sales_channel_id?: string
}
