import { Context } from "@zjedene-medusa/types"
import { EventArgs, EventSubscriber } from "@mikro-orm/core"
type Service = {
  interceptEntityMutationEvents: (
    event: "afterCreate" | "afterUpdate" | "afterUpsert" | "afterDelete",
    args: EventArgs<any>,
    context: Context
  ) => void
}

export type MedusaMikroOrmEventSubscriber = {
  new (context: Context): EventSubscriber
}

/**
 * Build a new mikro orm event subscriber for the given models
 * @param models
 * @returns
 */
export function createMedusaMikroOrmEventSubscriber(
  keys: string[],
  service: Service
): MedusaMikroOrmEventSubscriber {
  const klass = class MikroOrmEventSubscriber implements EventSubscriber {
    #context: Context
    #service: Service = service

    constructor(context: Context) {
      this.#context = context
    }

    async afterCreate<T>(args: EventArgs<T>): Promise<void> {
      this.#service.interceptEntityMutationEvents(
        "afterCreate",
        args,
        this.#context
      )
    }

    async afterUpdate<T>(args: EventArgs<T>): Promise<void> {
      this.#service.interceptEntityMutationEvents(
        "afterUpdate",
        args,
        this.#context
      )
    }

    async afterUpsert<T>(args: EventArgs<T>): Promise<void> {
      this.#service.interceptEntityMutationEvents(
        "afterUpsert",
        args,
        this.#context
      )
    }

    async afterDelete<T>(args: EventArgs<T>): Promise<void> {
      this.#service.interceptEntityMutationEvents(
        "afterDelete",
        args,
        this.#context
      )
    }
  }

  Object.defineProperty(klass, "name", {
    value: keys.join(","),
    writable: false,
  })

  return klass
}
