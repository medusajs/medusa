import { css } from "@emotion/core"

const Largest = props => css`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  font-size: 22px;
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: normal;
`

const Large = props => css`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.22;
  letter-spacing: -0.5px;
`

const Medium = props => css`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.22;
  letter-spacing: normal;
`

const Base = props => css`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.22;
  letter-spacing: -0.25px;
`

const Small = props => css`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 12px;
  letter-spacing: 0px;
`

export default {
  Largest,
  Large,
  Medium,
  Base,
  Small,
}
