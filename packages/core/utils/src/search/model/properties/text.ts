import { StringSearchProperty } from "./base"

export class TextProperty extends StringSearchProperty {
  protected dataType: { name: "text"; options?: Record<string, any> } = {
    name: "text",
  }
}
