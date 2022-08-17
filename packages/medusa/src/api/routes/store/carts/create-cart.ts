import { CartService, LineItemService, RegionService } from "../../../../services"
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations, } from "."

import { Cart } from "../../../../models";
import { EntityManager } from "typeorm"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators";
import { FlagRouter } from "../../../../utils/flag-router"
import { MedusaError } from "medusa-core-utils"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels";
import { Type } from "class-transformer"
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"
import reqIp from "request-ip"
import { isDefined } from "../../../../utils";

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
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: "Successfully created a new Cart"
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
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

  let cart: Cart
  await entityManager.transaction(async (manager) => {
    cart = await cartService.withTransaction(manager).create({
      ...validated,
      context: {
        ...reqContext,
        ...validated.context,
      },
      region_id: regionId,
     })

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

  cart = await cartService.retrieve(cart!.id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  const data = await decorateLineItemsWithTotals(cart, req)

  res.status(200).json({ cart: data })
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
