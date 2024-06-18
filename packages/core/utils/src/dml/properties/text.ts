import { BaseProperty } from "./base"

/**
 * The TextProperty is used to define a textual property
 */
export class TextProperty extends BaseProperty<string> {
  protected dataType = {
    name: "text",
  } as const
}
