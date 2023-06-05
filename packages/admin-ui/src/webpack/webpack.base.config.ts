import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import { Configuration, DefinePlugin } from "webpack"
import { BuildOptions } from "../types"
import { IS_DEV } from "./constants"
import { loaders } from "./loaders"
import { webpackAlias } from "./webpack.alias"

function filename(ext: string): string {
  return IS_DEV ? `[name].${ext}` : `[name].[chunkhash].${ext}`
}

export function getBaseConfig({
  outDir,
  publicPath = "/app",
}: BuildOptions): Configuration {
  return {
    name: "admin",
    target: "web",
    entry: ["./src/main.tsx"],
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        title: "Medusa Admin",
      }),
      new MiniCssExtractPlugin(),
      new DefinePlugin({
        __BASE__: JSON.stringify(publicPath),
      }),
    ],
    context: path.resolve(__dirname, "..", "ui"),
    output: {
      path: outDir,
      filename: filename("js"),
      publicPath,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
      alias: webpackAlias,
    },
    module: {
      rules: loaders,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
        },
      },
    },
  }
}
