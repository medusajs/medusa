/** A CSS style object, in the camelCased subset satori understands. */
export type StyleObject = Record<string, string | number>

/**
 * A node in the banner's element tree.
 *
 * Satori only needs objects of this shape — `{ type, props, key }` — so the
 * template builds them directly instead of pulling in JSX tooling and React.
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

export type PillSpec = {
  /** Total height, rim included. */
  height: number
  /** Distance from the pill's edge to the logomark. */
  paddingLeft: number
  /** Distance from the end of the version text to the pill's edge. */
  paddingRight: number
  /** Vertical offset from the centre of the canvas. */
  offsetY: number
  borderWidth: number
  borderGradient: GradientStop[]
  fillGradient: GradientStop[]
}

export type ContentSpec = {
  /** Visible height of the logomark. */
  logoHeight: number
  /** Space between the logomark and the version text. */
  gap: number
  fontSize: number
  fontWeight: number
  letterSpacing: number
  /** Nudge to optically centre the version text against the logomark. */
  textOffsetY: number
  logoGradient: GradientStop[]
  textGradient: GradientStop[]
}

export type BannerSpec = {
  width: number
  height: number
  background: string
  pill: PillSpec
  content: ContentSpec
}

/**
 * A partial spec, overriding the defaults one section at a time.
 */
export type BannerSpecOverrides = Partial<
  Omit<BannerSpec, "pill" | "content">
> & {
  pill?: Partial<PillSpec>
  content?: Partial<ContentSpec>
}

export type RenderOptions = {
  /** Version label rendered inside the pill, e.g. `v2.19.0`. */
  version: string
  spec?: BannerSpecOverrides
}
