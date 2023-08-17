import webpack, { type Configuration } from "webpack"

/**
 * Helper function to create a custom webpack config that can be used to
 * extend the default webpack config used to build the admin UI.
 */
export function withCustomWebpackConfig(
  callback: (
    config: Configuration,
    webpackInstance: typeof webpack
  ) => Configuration
) {
  return (config: Configuration, webpackInstance: typeof webpack) => {
    return callback(config, webpackInstance)
  }
}
