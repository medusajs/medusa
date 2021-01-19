import { DefaultNamingStrategy } from "typeorm"

export class ShortenedNamingStrategy extends DefaultNamingStrategy {
  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    let out = alias + '_' + propertyPath.replace('.', '_')
    let match = out.match(/_/g) || []
    return out + match.length
  }
}

