// packages/modules/channel-price/src/services/channel-price-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import ChannelPrice from "../models/channel-price"
import { CreateChannelPriceDTO, UpdateChannelPriceDTO } from "../types"

export class ChannelPriceModuleService extends MedusaService<{
  ChannelPrice: { dto: CreateChannelPriceDTO; updateDto: UpdateChannelPriceDTO }
}>({ ChannelPrice }) {}
