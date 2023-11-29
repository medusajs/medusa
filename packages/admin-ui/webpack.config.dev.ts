import { DuplicateReporterPlugin } from "duplicate-dependencies-webpack-plugin"
import path from "path"
import openBrowser from "react-dev-utils/openBrowser"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import { Configuration } from "webpack-dev-server"
import { getWebpackConfig } from "./src/node/webpack/get-webpack-config"

const getDevServerConfig = () => {
  const analyzeBundle = process.env.ANALYZE_BUNDLE
  const analyzeDuplicateDependencies = process.env.ANALYZE_DEPS

  const devConfig = getWebpackConfig({
    cacheDir: __dirname,
    dest: path.resolve(__dirname, "build"),
    entry: path.resolve(__dirname, "ui", "src", "main.tsx"),
    env: "development",
    options: {
      backend: "http://localhost:9000",
      path: "/",
    },
    template: path.resolve(__dirname, "ui", "index.html"),
    publicFolder: path.resolve(__dirname, "ui", "public"),
  })

  if (analyzeBundle) {
    devConfig.plugins?.push(new BundleAnalyzerPlugin())
  }

  if (analyzeDuplicateDependencies === "true") {
    devConfig.plugins?.push(new DuplicateReporterPlugin())
  }

  return {
    ...devConfig,
    ...{
      devServer: {
        port: 7001,
        hot: true,
        historyApiFallback: true,
        client: {
          progress: false,
        },
        static: {
          directory: path.resolve(__dirname, "./ui/public"),
          publicPath: "/",
        },
        open: false,
        onListening: function () {
          openBrowser(`http://localhost:7001`)
        },
        allowedHosts: "auto",
      } as Configuration,
    },
  }
}

module.exports = getDevServerConfig()
