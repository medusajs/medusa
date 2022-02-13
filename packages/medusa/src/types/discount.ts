import { IsEnum, IsOptional } from "class-validator"
import { AllocationType, DiscountRuleType } from "../models/discount-rule"

export type QuerySelector = {
  q?: string
}

export class ListSelector {
  q?: string
  is_dynamic?: boolean
  is_disabled?: boolean
}
