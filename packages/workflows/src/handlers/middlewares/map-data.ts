import { WorkflowArguments } from "../../helper"

export function mapData<S>(fn: Function, alias?: string) {
  return async function <T = any>(args: WorkflowArguments<T>) {
    const ret = {
      value: fn(args.data),
    } as S

    if (alias) {
      ret["alias"] = alias
    }

    return ret
  }
}
