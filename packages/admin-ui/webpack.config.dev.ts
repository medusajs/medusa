import { DuplicateReporterPlugin } from "duplicate-dependencies-webpack-plugin"
import path from "path"
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
        historyApiFallback: true,
      } as Configuration,
    },
  }
}

module.exports = getDevServerConfig()
