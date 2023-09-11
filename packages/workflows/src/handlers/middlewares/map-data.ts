import { WorkflowArguments } from "../../helper"

export function mapData<S>(fn: Function) {
  return async function <T = any>(args: WorkflowArguments<T>) {
    return {
      alias: "mapData",
      value: fn(args.data),
    } as S
  }
}
