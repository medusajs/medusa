import { transform } from "@svgr/core"
import jsx from "@svgr/plugin-jsx"
import prettier from "@svgr/plugin-prettier"
import svgo from "@svgr/plugin-svgo"

import { defaultTemplate, fixedTemplate } from "@/templates"

type TransformArgs = {
  code: string
  componentName: string
  fixed?: boolean
}

export async function transformSvg({
  code,
  componentName,
  fixed = false,
}: TransformArgs) {
  return await transform(
    code,
    {
      typescript: true,
      replaceAttrValues: !fixed
        ? {
            "#18181B": "{color}",
          }
        : undefined,
      svgProps: {
        ref: "{ref}",
      },
      expandProps: "end",
      plugins: [svgo, jsx, prettier],
      jsxRuntime: "classic",
      prettierConfig: {
        semi: false,
        parser: "typescript",
      },
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeTitle: false,
              },
            },
          },
        ],
      },
      template: fixed ? fixedTemplate : defaultTemplate,
    },
    {
      componentName,
    }
  )
}
