export type Ref<T> =
  | React.MutableRefObject<T | null>
  | ((instance: T | null) => void)

export type Key = {
  key?: string | number | null | undefined
}
