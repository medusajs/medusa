import type { Thing, WithContext } from "schema-dts"

export function getJsonLd<T extends Thing>(data: WithContext<T>): string {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c")
}
