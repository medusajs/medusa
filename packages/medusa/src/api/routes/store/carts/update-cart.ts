import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"

import { MedusaV2Flag } from "@medusajs/utils"
import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { AddressPayload } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [post] /store/carts/{id}
 * operationId: PostCartsCart
 * summary: Update a Cart
 * description: "Update a Cart's details. If the cart has payment sessions and the region was not changed, the payment sessions are updated. The cart's totals are also recalculated."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCartsCartReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.update(cartId, {
 *         email: "user@example.com"
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartsRes"
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
  const { id } = req.params
  const validated = req.validatedBody as StorePostCartsCartReq

  const cartService: CartService = req.scope.resolve("cartService")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")
  const manager: EntityManager = req.scope.resolve("manager")

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  if (req.user?.customer_id) {
    validated.customer_id = req.user.customer_id
  }

  let cart
  if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    cart = await retrieveCartWithIsolatedProductModule(req, id)
  }

  await manager.transaction(async (transactionManager) => {
    await cartService
      .withTransaction(transactionManager)
      .update(cart ?? id, validated)

    const updated = await cartService
      .withTransaction(transactionManager)
      .retrieve(id, {
        relations: ["payment_sessions", "shipping_methods"],
      })

    if (updated.payment_sessions?.length && !validated.region_id) {
      await cartService
        .withTransaction(transactionManager)
        .setPaymentSessions(id)
    }
  })

  const data = await cartService.retrieveWithTotals(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  await productVariantInventoryService.setVariantAvailability(
    data.items.map((i) => i.variant),
    data.sales_channel_id!
  )

  res.json({ cart: cleanResponseData(data, []) })
}

async function retrieveCartWithIsolatedProductModule(req, id: string) {
  const cartService = req.scope.resolve("cartService")
  const remoteQuery = req.scope.resolve("remoteQuery")

  const relations = [
    "items",
    "shipping_methods",
    "shipping_methods.shipping_option",
    "shipping_address",
    "billing_address",
    "gift_cards",
    "customer",
    "region",
    "payment_sessions",
    "region.countries",
    "discounts",
    "discounts.rule",
  ]

  const cart = await cartService.retrieve(id, {
    relations,
  })

  const products = await remoteQuery({
    products: {
      __args: {
        id: cart.items.map((i) => i.product_id),
      },
      fields: ["id"],
      variants: {
        fields: ["id"],
      },
    },
  })

  const variantsMap = new Map(
    products.flatMap((p) => p.variants).map((v) => [v.id, v])
  )

  cart.items.forEach((item) => {
    if (!item.variant_id) {
      return
    }

    item.variant = variantsMap.get(item.variant_id)
  })

  return cart
}

class GiftCard {
  @IsString()
  code: string
}

class Discount {
  @IsString()
  code: string
}

/**
 * @schema StorePostCartsCartReq
 * type: object
 * properties:
 *   region_id:
 *     type: string
 *     description: "The ID of the Region to create the Cart in. Setting the cart's region can affect the pricing of the items in the cart as well as the used currency."
 *   country_code:
 *     type: string
 *     description: "The 2 character ISO country code to create the Cart in. Setting this parameter will set the country code of the shipping address."
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *       description: See a list of codes.
 *   email:
 *     type: string
 *     description: "An email to be used on the Cart."
 *     format: email
 *   sales_channel_id:
 *     type: string
 *     description: "The ID of the Sales channel to create the Cart in. The cart's sales channel affects which products can be added to the cart. If a product does not
 *      exist in the cart's sales channel, it cannot be added to the cart. If you add a publishable API key in the header of this request and specify a sales channel ID,
 *      the specified sales channel must be within the scope of the publishable API key's resources."
 *   billing_address:
 *     description: "The Address to be used for billing purposes."
 *     anyOf:
 *       - $ref: "#/components/schemas/AddressPayload"
 *         description: A full billing address object.
 *       - type: string
 *         description: The billing address ID
 *   shipping_address:
 *     description: "The Address to be used for shipping purposes."
 *     anyOf:
 *       - $ref: "#/components/schemas/AddressPayload"
 *         description: A full shipping address object.
 *       - type: string
 *         description: The shipping address ID
 *   gift_cards:
 *     description: "An array of Gift Card codes to add to the Cart."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           description: "The code of a gift card."
 *           type: string
 *   discounts:
 *     description: "An array of Discount codes to add to the Cart."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           description: "The code of the discount."
 *           type: string
 *   customer_id:
 *     description: "The ID of the Customer to associate the Cart with."
 *     type: string
 *   context:
 *     description: >-
 *       An object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`
 *     type: object
 *     example:
 *       ip: "::1"
 *       user_agent: "Chrome"
 */
export class StorePostCartsCartReq {
  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsString()
  country_code?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsOptional()
  @IsType([AddressPayload, String])
  billing_address?: AddressPayload | string

  @IsOptional()
  @IsType([AddressPayload, String])
  shipping_address?: AddressPayload | string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiftCard)
  gift_cards?: GiftCard[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Discount)
  discounts?: Discount[]

  @IsString()
  @IsOptional()
  customer_id?: string

  @IsOptional()
  context?: object

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
    IsString(),
    IsOptional(),
  ])
  sales_channel_id?: string
}
