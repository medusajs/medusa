import { RangeFacetSearchProperty } from "./base"

export class FloatProperty extends RangeFacetSearchProperty<number> {
  protected dataType: { name: "float"; options?: Record<string, any> } = {
    name: "float",
  }
}
