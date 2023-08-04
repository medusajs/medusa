import { InputAlias } from "../../definitions"

export function createProductsPrepareData({ data }) {
  return {
    alias: InputAlias.Products as string,
    value: [{}],
  }
}
