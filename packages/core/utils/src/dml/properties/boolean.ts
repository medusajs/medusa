import { BaseProperty } from "./base"

/**
 * The BooleanProperty class is used to define a boolean
 * property
 */
export class BooleanProperty extends BaseProperty<boolean> {
  protected dataType = {
    name: "boolean",
  } as const
}
