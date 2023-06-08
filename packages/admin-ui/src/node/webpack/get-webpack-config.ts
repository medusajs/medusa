import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "node:path"
import { SwcMinifyWebpackPlugin } from "swc-minify-webpack-plugin"
import type { Configuration } from "webpack"
import webpack from "webpack"
import WebpackBar from "webpackbar"
import { WebpackConfigArgs } from "../types"
import { getClientEnv } from "../utils"
import { webpackAliases } from "./webpack-aliases"

export function getWebpackConfig({
  entry,
  dest,
  cacheDir,
  env,
  options,
}: WebpackConfigArgs): Configuration {
  const isProd = env === "production"

  const envVars = getClientEnv({
    env,
    backend: options?.backend,
    publicPath: options?.publicPath || "/app",
  })

  const webpackPlugins = isProd
    ? [
        new MiniCssExtractPlugin({
          filename: "[name].[chunkhash].css",
          chunkFilename: "[name].[chunkhash].css",
        }),
        new WebpackBar(),
      ]
    : [new MiniCssExtractPlugin()]

  return {
    mode: env,
    bail: !!isProd,
    devtool: isProd ? false : "eval-source-map",
    entry: [entry],
    output: {
      path: dest,
      publicPath: "/",
      filename: isProd ? "[name].[contenthash:8].js" : "[name].bundle.js",
      chunkFilename: isProd
        ? "[name].[contenthash:8].chunk.js"
        : "[name].chunk.js",
    },
    optimization: {
      minimize: true,
      minimizer: [new SwcMinifyWebpackPlugin()],
      moduleIds: "deterministic",
      runtimeChunk: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          include: [cacheDir],
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                transform: {
                  react: {
                    runtime: "automatic",
                  },
                },
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.svg$/,
          oneOf: [
            {
              type: "asset/resource",
              resourceQuery: /url/,
            },
            {
              type: "asset/inline",
              resourceQuery: /base64/,
            },
            {
              issuer: /\.[jt]sx?$/,
              use: ["@svgr/webpack"],
            },
          ],
          generator: {
            filename: `images/${isProd ? "[name]-[hash][ext]" : "[name][ext]"}`,
          },
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          type: "asset/resource",
        },
        {
          test: /\.(js|mjs)(\.map)?$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.m?jsx?$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      alias: webpackAliases,
      symlinks: false,
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      mainFields: ["browser", "module", "main"],
      modules: ["node_modules", path.resolve(__dirname, "..", "node_modules")],
      fallback: {
        readline: false,
        path: false,
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, "..", "..", "..", "ui", "index.html"),
      }),

      new webpack.DefinePlugin(envVars),

      !isProd && new ReactRefreshPlugin(),

      ...webpackPlugins,
    ].filter(Boolean),
  }
}
