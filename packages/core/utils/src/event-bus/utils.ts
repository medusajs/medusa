import { KebabCase, SnakeCase } from "@medusajs/types"
import { camelToSnakeCase, kebabCase, lowerCaseFirst } from "../common"
import { CommonEvents } from "./common-events"

type ReturnType<TNames extends string[]> = {
  [K in TNames[number] as `${Uppercase<
    SnakeCase<K & string>
  >}_CREATED`]: `${KebabCase<K & string>}.created`
} & {
  [K in TNames[number] as `${Uppercase<
    SnakeCase<K & string>
  >}_UPDATED`]: `${KebabCase<K & string>}.updated`
} & {
  [K in TNames[number] as `${Uppercase<
    SnakeCase<K & string>
  >}_DELETED`]: `${KebabCase<K & string>}.deleted`
} & {
  [K in TNames[number] as `${Uppercase<
    SnakeCase<K & string>
  >}_RESTORED`]: `${KebabCase<K & string>}.restored`
} & {
  [K in TNames[number] as `${Uppercase<
    SnakeCase<K & string>
  >}_ATTACHED`]: `${KebabCase<K & string>}.attached`
} & {
  [K in TNames[number] as `${Uppercase<
    SnakeCase<K & string>
  >}_DETACHED`]: `${KebabCase<K & string>}.detached`
}

/**
 * Build a conventional event name from the object name and the action and the prefix if provided
 * @param prefix
 * @param objectName
 * @param action
 */
export function buildModuleResourceEventName({
  prefix,
  objectName,
  action,
}: {
  prefix?: string
  objectName: string
  action: string
}): string {
  const kebabCaseName = lowerCaseFirst(kebabCase(objectName))
  return `${prefix ? `${prefix}.` : ""}${kebabCaseName}.${action}`
}

/**
 * From the given strings it will produce the event names accordingly.
 * the result will look like:
 * input: 'serviceZone'
 * output: {
 *   SERVICE_ZONE_CREATED: 'service-zone.created',
 *   SERVICE_ZONE_UPDATED: 'service-zone.updated',
 *   SERVICE_ZONE_DELETED: 'service-zone.deleted',
 *   SERVICE_ZONE_RESTORED: 'service-zone.restored',
 *   SERVICE_ZONE_ATTACHED: 'service-zone.attached',
 *   SERVICE_ZONE_DETACHED: 'service-zone.detached',
 *   ...
 * }
 *
 * @param names
 * @param prefix
 */
export function buildEventNamesFromEntityName<TNames extends string[]>(
  names: TNames,
  prefix?: string
): ReturnType<TNames> {
  const events = {}

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const snakedCaseName = camelToSnakeCase(name).toUpperCase()

    for (const event of Object.values(CommonEvents) as string[]) {
      const upperCasedEvent = event.toUpperCase()
      events[`${snakedCaseName}_${upperCasedEvent}`] =
        buildModuleResourceEventName({
          prefix,
          objectName: name,
          action: event,
        }) as `${KebabCase<typeof name>}.${typeof event}`
    }
  }

  return events as ReturnType<TNames>
}
