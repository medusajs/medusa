import { MetadataStorage } from "@mikro-orm/core"

export function Searchable() {
  return function (target, propertyName) {
    const meta = MetadataStorage.getMetadataFromDecorator(target.constructor)
    const prop = meta.properties[propertyName] || {}
    prop["searchable"] = true
    meta.properties[prop.name] = prop
  }
}
