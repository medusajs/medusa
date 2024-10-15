import { Prettify } from "../../common"

export type ExcludedProps = "__typename"
export type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export type CleanupObject<T> = Prettify<Omit<Exclude<T, symbol>, ExcludedProps>>
export type OmitNever<T extends object> = {
  [K in keyof T as TypeOnly<T[K]> extends never ? never : K]: T[K]
}
export type TypeOnly<T> = Required<Exclude<T, null | undefined>>
