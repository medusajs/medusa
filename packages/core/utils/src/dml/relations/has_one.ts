import type { EntityBuilder } from "../entity_builder"

export class HasOneRelation<T> {
  constructor(builder: T) {}

  via(k: string) {}
}
