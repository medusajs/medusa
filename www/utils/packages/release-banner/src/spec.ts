import type { BannerSpec } from "./types.js"

/**
 * Design spec for the release banner.
 *
 * Every number was measured off the v2.13.0 banner, which is the reference this
 * template reproduces:
 * https://gh-release-images.s3.eu-north-1.amazonaws.com/v-2-13-0.jpg
 *
 * Sizes are in pixels at the reference resolution of 3200x1672. Override
 * `width` and everything scales proportionally.
 */
export const SPEC: BannerSpec = {
  width: 3200,
  height: 1672,

  background: "#18171C",

  pill: {
    height: 536,
    paddingLeft: 147,
    paddingRight: 193,
    // The pill sits a hair above the centre of the canvas.
    offsetY: -4.5,
    borderWidth: 2,
    // The rim is brightest along the top and fades out towards the bottom.
    borderGradient: [
      [0, "rgba(255, 255, 255, 0.53)"],
      [0.55, "rgba(255, 255, 255, 0.42)"],
      [1, "rgba(255, 255, 255, 0)"],
    ],
    // A lifted grey at the top, easing down into the page background.
    fillGradient: [
      [0, "#4A494F"],
      [0.1, "#414046"],
      [0.25, "#313036"],
      [0.44, "#26252A"],
      [0.57, "#1E1D22"],
      [0.72, "#18171C"],
      [1, "#18171C"],
    ],
  },

  content: {
    logoHeight: 230,
    // Smaller than the gap you measure off the finished image, because the "v"
    // carries its own left side bearing.
    gap: 83,
    fontSize: 258,
    fontWeight: 400,
    letterSpacing: -3.5,
    // Flexbox centres the full line box, which includes descender space the
    // version string never uses. This pulls the digits back onto the logo's
    // optical centre.
    textOffsetY: 4,
    // Top-to-bottom sheen. The two are specified separately because the text's
    // line box is taller than the logo's, so a shared pair of stops would not
    // land alike.
    logoGradient: [
      [0, "#FEFEFE"],
      [1, "#BDBDBF"],
    ],
    textGradient: [
      [0, "#FDFDFD"],
      [1, "#BBBBBB"],
    ],
  },
}

/** The offset at which the pill's fill has resolved to the page background. */
export const FILL_RESOLVES_AT = 0.72
