/** A CSS style object, in the camelCased subset satori understands. */
export type StyleObject = Record<string, string | number>

/**
 * A node in a banner's element tree.
 *
 * Satori only needs objects of this shape — `{ type, props, key }` — so the
 * templates build them directly instead of pulling in JSX tooling and React.
 */
export type BannerNode = {
  type: string
  props: {
    style?: StyleObject
    children?: BannerNode | BannerNode[] | string
    [prop: string]: unknown
  }
  key: null
}

/** A gradient stop: an offset from 0 to 1, and the colour at that offset. */
export type GradientStop = [number, string]

/**
 * A partial spec, nested sections included.
 *
 * Arrays — gradients, in practice — are replaced wholesale rather than merged
 * index by index, which is never what overriding a gradient is meant to do.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

/** The canvas every banner is drawn on, whatever its type. */
export type BaseSpec = {
  width: number
  height: number
  background: string
}
