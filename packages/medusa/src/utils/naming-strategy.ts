import { DefaultNamingStrategy } from "typeorm"

const MAX_ALIAS_NAME_LENGTH = 63

export class ShortenedNamingStrategy extends DefaultNamingStrategy {
  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    const path = propertyPath
      .split(".")
      .map((p) => p.substring(0, 2))
      .join("_")

    let out = alias + "_" + path

    if (out.length > MAX_ALIAS_NAME_LENGTH) {
      out = out.substring(0, MAX_ALIAS_NAME_LENGTH - 6)
      const sixRandomDigits = Math.floor(100000 + Math.random() * 900000);
      out += sixRandomDigits
    }

    return out
  }
}
