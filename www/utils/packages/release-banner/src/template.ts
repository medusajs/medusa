import { logoDataUri } from "./logo.js"
import { SPEC } from "./spec.js"
import type {
  BannerNode,
  BannerSpec,
  GradientStop,
  RenderOptions,
  StyleObject,
} from "./types.js"

/** Element factory for the plain object tree satori consumes. */
function h(
  type: string,
  props: Record<string, unknown> = {},
  ...children: (BannerNode | string)[]
): BannerNode {
  return {
    type,
    props: {
      ...props,
      children: (children.length > 1
        ? children
        : children[0]) as BannerNode["props"]["children"],
    },
    key: null,
  }
}

function linearGradient(stops: GradientStop[], angle = "180deg"): string {
  const parts = stops.map(([offset, color]) => `${color} ${offset * 100}%`)
  return `linear-gradient(${angle}, ${parts.join(", ")})`
}

/** Merges overrides into the default spec, one section at a time. */
export function resolveSpec(overrides: RenderOptions["spec"] = {}): BannerSpec {
  return {
    ...SPEC,
    ...overrides,
    pill: { ...SPEC.pill, ...overrides.pill },
    content: { ...SPEC.content, ...overrides.content },
  }
}

/** Builds the banner's element tree. */
export function banner({
  version,
  spec: overrides,
}: RenderOptions): BannerNode {
  const spec = resolveSpec(overrides)

  const scale = spec.width / SPEC.width
  const px = (value: number): number => value * scale

  const logo = logoDataUri({
    height: px(spec.content.logoHeight),
    gradient: spec.content.logoGradient,
  })

  const versionStyle: StyleObject = {
    display: "flex",
    marginTop: px(spec.content.textOffsetY),
    fontSize: px(spec.content.fontSize),
    // Hug the glyphs so the sheen maps onto the digits rather than onto the
    // ascender and descender space around them.
    lineHeight: 1,
    fontWeight: spec.content.fontWeight,
    letterSpacing: px(spec.content.letterSpacing),
    // Gradient text: paint the gradient, clip it to the glyphs, hide the fill.
    backgroundImage: linearGradient(spec.content.textGradient),
    backgroundClip: "text",
    color: "transparent",
  }

  return h(
    "div",
    {
      style: {
        width: spec.width,
        height: spec.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: spec.background,
      },
    },
    // The outer element's gradient background *is* the rim: padding of
    // `borderWidth` exposes it as a hairline around the inner surface, which is
    // how you get a gradient border in satori, which has no border-image.
    h(
      "div",
      {
        style: {
          display: "flex",
          marginTop: px(spec.pill.offsetY),
          padding: px(spec.pill.borderWidth),
          borderRadius: 9999,
          backgroundImage: linearGradient(spec.pill.borderGradient),
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            // `pill.height` covers the rim, which the padding above contributes.
            height: px(spec.pill.height - spec.pill.borderWidth * 2),
            paddingLeft: px(spec.pill.paddingLeft),
            paddingRight: px(spec.pill.paddingRight),
            borderRadius: 9999,
            backgroundImage: linearGradient(spec.pill.fillGradient),
          },
        },
        h("img", {
          src: logo.src,
          width: logo.width,
          height: logo.height,
          style: { marginRight: px(spec.content.gap) },
        }),
        h("div", { style: versionStyle }, version)
      )
    )
  )
}
