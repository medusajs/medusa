import { RangeFacetSearchProperty } from "./base"

// Documents carry dates as Date objects out of query.graph and as ISO strings
// off events, so the value type admits both.
export class DateProperty extends RangeFacetSearchProperty<Date | string> {
  protected dataType: { name: "date"; options?: Record<string, any> } = {
    name: "date",
  }
}
