import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
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

function formatPublicPath(path?: string) {
  if (!path) {
    return "/app/"
  }

  if (path === "/") {
    return path
  }

  return path.endsWith("/") ? path : `${path}/`
}

export function getWebpackConfig({
  entry,
  dest,
  cacheDir,
  env,
  options,
  template,
  publicFolder,
  reporting = "fancy",
}: WebpackConfigArgs): Configuration {
  const isProd = env === "production"

  const envVars = getClientEnv({
    env,
    backend: options?.backend,
    path: options?.path,
  })

  const publicPath = formatPublicPath(options?.path)

  const webpackPlugins = isProd
    ? [
        new MiniCssExtractPlugin({
          filename: "[name].[chunkhash].css",
          chunkFilename: "[name].[chunkhash].css",
        }),
        new WebpackBar({
          basic: reporting === "minimal",
          fancy: reporting === "fancy",
        }),
      ]
    : [new MiniCssExtractPlugin(), new ReactRefreshPlugin()]

  return {
    mode: env,
    devtool: isProd ? false : "inline-source-map",
    entry: [entry],
    output: {
      path: dest,
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
                parser: {
                  syntax: "typescript", // Use TypeScript syntax for parsing
                  jsx: true, // Enable JSX parsing
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: !isProd,
                    refresh: !isProd,
                  },
                },
              },
            },
          },
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: [cacheDir],
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "ecmascript", // Use Ecmascript syntax for parsing
                  jsx: true, // Enable JSX parsing
                },
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
        template: template || path.resolve(__dirname, "..", "ui", "index.html"),
        publicPath: publicPath,
      }),

      new webpack.DefinePlugin(envVars),

      new CopyPlugin({
        patterns: [
          {
            from: publicFolder || path.resolve(__dirname, "..", "ui", "public"),
            to: path.resolve(dest, "public"),
          },
        ],
      }),

      ...webpackPlugins,
    ].filter(Boolean),
    stats: isProd ? "errors-only" : "errors-warnings",
  }
}
