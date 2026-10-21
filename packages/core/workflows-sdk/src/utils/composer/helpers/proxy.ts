import { transform } from "../transform"
import { WorkflowData } from "../type"

export function proxify<T>(obj: WorkflowData<any>): T {
  return new Proxy(obj, {
    get(target: any, prop: string | symbol): any {
      if (prop in target) {
        return target[prop]
      }

      const transformer = transform(target, function (data) {
        return data?.[prop]
      })

      return transformer
    },
  }) as unknown as T
}
