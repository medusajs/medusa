import { BaseProperty } from "./base"

/**
 * The DateTimeProperty class is used to define a timestampz
 * property
 */
export class DateTimeProperty extends BaseProperty<Date> {
  protected dataType = {
    name: "dateTime",
  } as const
}
