import { h, linearGradient } from "../../element.js"
import { logoDataUri } from "../../logo.js"
import { scaler } from "../../spec.js"
import type { BannerNode, DeepPartial } from "../../types.js"
import { CLOUD_CHANGELOG_SPEC, type CloudChangelogSpec } from "./spec.js"

export type CloudChangelogInput = {
  type: "cloud-changelog"
  /** Date shown after the wordmark, rendered as given — e.g. `Aug 17`. */
  date: string
  spec?: DeepPartial<CloudChangelogSpec>
}

/** Builds the Cloud changelog banner's element tree. */
export function buildCloudChangelog(
  { date }: CloudChangelogInput,
  spec: CloudChangelogSpec
): BannerNode {
  const px = scaler(spec, CLOUD_CHANGELOG_SPEC)
  const { pill, content } = spec

  const logo = logoDataUri({
    height: px(content.logoHeight),
    color: content.logoColor,
  })

  // Two inset shadows and a cast one, in the order the design layers them: the
  // lit top edge, the ring around the whole pill, then the shadow it throws.
  //
  // The spread is clamped at zero because satori draws it as a stroke around
  // the shadow's shape, and a negative one comes out as a negative
  // `stroke-width` — which resvg does not reject but panics on.
  const spread = Math.max(pill.shadowSpread, 0)
  const shadow = [
    `inset 0 ${px(pill.hairline)}px 0 ${pill.highlightColor}`,
    `inset 0 0 0 ${px(pill.hairline)}px ${pill.ringColor}`,
    `0 ${px(pill.shadowOffsetY)}px ${px(pill.shadowBlur)}px ` +
      `${px(spread)}px ${pill.shadowColor}`,
  ].join(", ")

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
        fontFamily: "Inter",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          height: px(pill.height),
          paddingLeft: px(pill.paddingLeft),
          paddingRight: px(pill.paddingRight),
          borderRadius: 9999,
          backgroundImage: linearGradient(pill.fillGradient),
          boxShadow: shadow,
        },
      },
      h("img", {
        src: logo.src,
        width: logo.width,
        height: logo.height,
        style: { marginRight: px(content.gap) },
      }),
      h(
        "div",
        {
          style: {
            display: "flex",
            // Hug the glyphs, so the wordmark centres on the logomark rather
            // than on the ascender and descender space around it.
            lineHeight: 1,
            fontSize: px(content.fontSize),
            fontWeight: content.fontWeight,
            letterSpacing: px(content.letterSpacing),
            color: content.color,
          },
        },
        content.wordmark
      ),
      h("div", {
        style: {
          display: "flex",
          width: px(content.dividerWidth),
          height: px(content.dividerHeight),
          marginLeft: px(content.dividerMargin),
          marginRight: px(content.dividerMargin),
          backgroundColor: content.dividerColor,
        },
      }),
      h(
        "div",
        {
          style: {
            display: "flex",
            lineHeight: 1,
            fontFamily: content.dateFontFamily,
            fontSize: px(content.dateFontSize),
            fontWeight: content.dateFontWeight,
            letterSpacing: px(content.dateLetterSpacing),
            color: content.dateColor,
          },
        },
        date
      )
    )
  )
}
