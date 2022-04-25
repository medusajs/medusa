import { Type } from "class-transformer"
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { MedusaError } from "medusa-core-utils"
import reqIp from "request-ip"
import { EntityManager } from "typeorm"

import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService, LineItemService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { AddressPayload } from "../../../../types/common"

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
 *             description: The id of the Region to create the Cart in.
 *           country_code:
 *             type: string
 *             description: "The 2 character ISO country code to create the Cart in."
 *           items:
 *             description: "An optional array of `variant_id`, `quantity` pairs to generate Line Items from."
 *             type: array
 *             items:
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
  const validated = await validator(StorePostCartReq, req.body)

  const reqContext = {
    ip: reqIp.getClientIp(req),
    user_agent: req.get("user-agent"),
  }

  const lineItemService: LineItemService = req.scope.resolve("lineItemService")
  const cartService: CartService = req.scope.resolve("cartService")

  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    // Add a default region if no region has been specified
    let regionId: string

    if (typeof validated.region_id !== "undefined") {
      regionId = validated.region_id
    } else {
      const regionService = req.scope.resolve("regionService")
      const regions = await regionService.withTransaction(manager).list({})

      if (!regions?.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `A region is required to create a cart`
        )
      }

      regionId = regions[0].id
    }

    const toCreate: {
      region_id: string
      context: object
      customer_id?: string
      email?: string
      shipping_address?: Partial<AddressPayload>
    } = {
      region_id: regionId,
      context: {
        ...reqContext,
        ...validated.context,
      },
    }

    if (req.user && req.user.customer_id) {
      const customerService = req.scope.resolve("customerService")
      const customer = await customerService
        .withTransaction(manager)
        .retrieve(req.user.customer_id)
      toCreate["customer_id"] = customer.id
      toCreate["email"] = customer.email
    }

    if (validated.country_code) {
      toCreate["shipping_address"] = {
        country_code: validated.country_code.toLowerCase(),
      }
    }

    let cart = await cartService.withTransaction(manager).create(toCreate)
    if (validated.items) {
      await Promise.all(
        validated.items.map(async (i) => {
          const lineItem = await lineItemService
            .withTransaction(manager)
            .generate(i.variant_id, regionId, i.quantity, {
              customer_id: req.user?.customer_id,
            })
          await cartService
            .withTransaction(manager)
            .addLineItem(cart.id, lineItem)
        })
      )
    }

    cart = await cartService.withTransaction(manager).retrieve(cart.id, {
      select: defaultStoreCartFields,
      relations: defaultStoreCartRelations,
    })

    res.status(200).json({ cart })
  })
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
}
