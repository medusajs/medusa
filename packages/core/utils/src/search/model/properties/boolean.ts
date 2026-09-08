import { ScalarSearchProperty } from "./base"

export class BooleanProperty extends ScalarSearchProperty<boolean> {
  protected dataType: { name: "boolean"; options?: Record<string, any> } = {
    name: "boolean",
  }
}
