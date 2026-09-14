import { StringSearchProperty } from "./base"

export class KeywordProperty extends StringSearchProperty {
  protected dataType: { name: "keyword"; options?: Record<string, any> } = {
    name: "keyword",
  }
}
