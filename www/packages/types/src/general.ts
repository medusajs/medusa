export type Ref<T> =
  | React.MutableRefObject<T | null>
  | ((instance: T | null) => void)
