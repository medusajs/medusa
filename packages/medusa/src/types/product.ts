import { ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"
import { DateComparisonOperator, StringComparisonOperator } from "./common"

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export class FilterableProductTagProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  value?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator
}

export class FilterableProductTypeProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  value?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator
}
