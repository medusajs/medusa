import { ScalarSearchProperty } from "./base"

export class GeoProperty extends ScalarSearchProperty<{
  lat: number
  lng: number
}> {
  protected dataType: { name: "geo"; options?: Record<string, any> } = {
    name: "geo",
  }
}
