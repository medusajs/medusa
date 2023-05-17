const path = require("path")
const { EnvironmentPlugin, IgnorePlugin } = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")

// Mark our dev dependencies as externals so they don't get included in the webpack bundle.
const { devDependencies } = require("./package.json")
const externals = {}

for (const devDependency of Object.keys(devDependencies)) {
  externals[devDependency] = `commonjs ${devDependency}`
}

// And anything MikroORM's packaging can be ignored if it's not on disk.
// Later we check these dynamically and tell webpack to ignore the ones we don't have.
const optionalModules = new Set([
  ...Object.keys(require("knex/package.json").browser),
  ...Object.keys(require("@mikro-orm/core/package.json").peerDependencies),
  ...Object.keys(require("@mikro-orm/core/package.json").devDependencies || {}),
])

module.exports = {
  entry: path.resolve("src", "index.ts"),

  // You can toggle development mode on to better see what's going on in the webpack bundle,
  // but for anything that is getting deployed, you should use 'production'.
  // mode: 'development',
  mode: "production",

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // We want to minify the bundle, but don't want Terser to change the names of our entity
          // classes. This can be controlled in a more granular way if needed, (see
          // https://terser.org/docs/api-reference.html#mangle-options) but the safest default
          // config is that we simply disable mangling altogether but allow minification to proceed.
          mangle: false,
          // Similarly, Terser's compression may at its own discretion change function and class names.
          // While it only rarely does so, it's safest to also disable changing their names here.
          // This can be controlled in a more granular way if needed (see
          // https://terser.org/docs/api-reference.html#compress-options).
          compress: {
            keep_classnames: true,
            keep_fnames: true,
          },
        },
      }),
    ],
  },
  target: "node",
  module: {
    rules: [
      // Bring in our typescript files.
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },

      // Native modules can be bundled as well.
      {
        test: /\.node$/,
        use: "node-loader",
      },

      // Some of MikroORM's dependencies use mjs files, so let's set them up here.
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },

  // These are computed above.
  externals,

  resolve: {
    extensions: [".ts", ".js"],
  },

  plugins: [
    // Ignore any of our optional modules if they aren't installed. This ignores database drivers
    // that we aren't using for example.
    new EnvironmentPlugin({ WEBPACK: true }),
    new IgnorePlugin({
      checkResource: (resource) => {
        const baseResource = resource
          .split("/", resource[0] === "@" ? 2 : 1)
          .join("/")

        if (optionalModules.has(baseResource)) {
          try {
            require.resolve(resource)
            return false
          } catch {
            return true
          }
        }

        return false
      },
    }),
  ],

  output: {
    filename: "server.js",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "..", "output"),
  },
}
