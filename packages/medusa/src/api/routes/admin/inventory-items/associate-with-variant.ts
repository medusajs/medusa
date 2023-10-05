import { IsNumber, IsObject, IsOptional, IsString } from "class-validator"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"

import { FindParams } from "../../../../types/common"
import { IInventoryService } from "@medusajs/types"
import { FlagRouter, ManyToManyInventoryFeatureFlag } from "@medusajs/utils"
import { createInventoryItemTransaction } from "./transaction/create-inventory-item"
import { validator } from "../../../../utils/validator"
import { featureFlagRouter } from "../../../../loaders/feature-flags"

export default async (req, res) => {
  const validated = await validator(
    AdminPostInventoryItemsItemVariantsReq,
    req.body
  )
  const { variant_id } = validated

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const flagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  if (flagRouter.isFeatureEnabled(ManyToManyInventoryFeatureFlag.key)) {
    console.log("enabled", variant_id)
  }

  // await createInventoryItemTransaction(
  //   {
  //     featureFlagRouter: flagRouter,
  //     inventoryService,
  //     productVariantInventoryService,
  //     productVariantService,
  //   },
  // )

  res.status(200).json({})
}

export class AdminPostInventoryItemsItemVariantsReq {
  @IsString()
  variant_id: string
}

export class AdminPostInventoryItemsItemVariantsParams extends FindParams {}
