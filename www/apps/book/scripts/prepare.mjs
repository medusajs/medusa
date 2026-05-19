import "dotenv/config"
import path from "path"
import { sidebars } from "../sidebar.mjs"
import {
  generateEditedDates,
  generateLlmsFull,
  generateSidebar,
} from "build-scripts"
import {
  addUrlToRelativeLink,
  changeLinksToHtmlMdPlugin,
  crossProjectLinksPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"

async function main() {
  await generateEditedDates()
  await generateSidebar(sidebars, {
    addNumbering: true,
  })
  const baseUrl =
    process.env.NEXT_PUBLIC_PROD_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
  const plugins = {
    before: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl,
          projectUrls: {
            resources: {
              url: baseUrl,
            },
            "user-guide": {
              url: baseUrl,
            },
            ui: {
              url: baseUrl,
            },
            api: {
              url: baseUrl,
            },
          },
          useBaseUrl: true,
        },
      ],
      [localLinksRehypePlugin],
    ],
    after: [[addUrlToRelativeLink, { url: baseUrl }]],
  }
  await generateLlmsFull({
    outputPath: path.join(process.cwd(), "public", "llms-full.txt"),
    plugins: {
      ...plugins,
      after: [...plugins.after, [changeLinksToHtmlMdPlugin]],
    },
    scanDirs: [
      {
        dir: path.join(process.cwd(), "app"),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "app",
          "commerce-modules"
        ),
        allowedFilesPatterns: [
          /^(?!.*\/(workflows|js-sdk|extend|admin-widget-zones)\/).*$/,
        ],
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "app",
          "infrastructure-modules"
        ),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "references",
          "core_flows"
        ),
        allowedFilesPatterns: [/Workflows_[^.]+\/functions/],
        generator: {
          name: "workflows",
          options: {
            baseUrl,
          },
        },
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "references",
          "core_flows"
        ),
        allowedFilesPatterns: [/Steps_[^.]+\/functions/],
        generator: {
          name: "steps",
          options: {
            baseUrl,
          },
        },
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "references",
          "modules",
          "events"
        ),
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "medusa-cli"),
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "medusa-cli"),
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "js-sdk"),
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "examples"),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "app",
          "how-to-tutorials"
        ),
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "integrations"),
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "plugins"),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "references",
          "js_sdk",
          "admin"
        ),
        allowedFilesPatterns: [/\/methods\//],
        generator: {
          name: "jsSdk",
          options: {
            baseUrl,
            type: "Admin",
          },
        },
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "references",
          "js_sdk",
          "auth"
        ),
        allowedFilesPatterns: [/\/methods\//],
        generator: {
          name: "jsSdk",
          options: {
            baseUrl,
            type: "Auth",
          },
        },
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "references",
          "js_sdk",
          "store"
        ),
        allowedFilesPatterns: [/\/properties\//],
        generator: {
          name: "jsSdk",
          options: {
            baseUrl,
            type: "Store",
          },
        },
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "app",
          "admin-components"
        ),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "app",
          "service-factory-reference"
        ),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "resources",
          "app",
          "nextjs-starter",
          "guides"
        ),
      },
      {
        dir: path.join(process.cwd(), "..", "api-reference", "markdown"),
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "api-reference",
          "specs",
          "admin",
          "paths"
        ),
        ext: "yaml",
        generator: {
          name: "apiRef",
          options: {
            baseUrl: `${baseUrl}/api/admin`,
            type: "Admin",
          },
        },
        options: {
          plugins,
        },
      },
      {
        dir: path.join(
          process.cwd(),
          "..",
          "api-reference",
          "specs",
          "store",
          "paths"
        ),
        ext: "yaml",
        generator: {
          name: "apiRef",
          options: {
            baseUrl: `${baseUrl}/api/store`,
            type: "Store",
          },
        },
        options: {
          plugins,
        },
      },
      {
        dir: path.join(process.cwd(), "..", "ui", "app"),
        options: {
          parserOptions: {
            ComponentExample: {
              examplesBasePath: path.join(
                process.cwd(),
                "..",
                "ui",
                "specs",
                "examples"
              ),
            },
            ComponentReference: {
              specsPath: path.join(
                process.cwd(),
                "..",
                "ui",
                "specs",
                "components"
              ),
            },
          },
        },
        allowedFilesPatterns: [/^(?!.*\/(colors|icons|hooks)\/).*$/],
      },
      {
        dir: path.join(process.cwd(), "..", "resources", "app", "recipes"),
      },
    ],
  })
}

void main()
