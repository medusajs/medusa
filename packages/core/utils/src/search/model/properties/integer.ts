import { RangeFacetSearchProperty } from "./base"

export class IntegerProperty extends RangeFacetSearchProperty<number> {
  protected dataType: { name: "integer"; options?: Record<string, any> } = {
    name: "integer",
  }
}
