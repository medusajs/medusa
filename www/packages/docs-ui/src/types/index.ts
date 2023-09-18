export type Ref<T> =
  | React.MutableRefObject<T | null>
  | ((instance: T | null) => void)

export type IconProps = {
  children?: never
  color?: string
  // TODO to remove
  iconColorClassName?: string
  containerClassName?: string
} & React.SVGAttributes<SVGElement>
