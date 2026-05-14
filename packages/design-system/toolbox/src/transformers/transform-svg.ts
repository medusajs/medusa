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

function ensureViewBox(code: string) {
  if (/viewBox\s*=/.test(code)) {
    return code
  }

  const svgTagMatch = code.match(/<svg\b[^>]*>/i)
  if (!svgTagMatch) {
    return code
  }

  const svgTag = svgTagMatch[0]
  const widthMatch = svgTag.match(/\bwidth\s*=\s*["']([^"']+)["']/i)
  const heightMatch = svgTag.match(/\bheight\s*=\s*["']([^"']+)["']/i)

  if (!widthMatch || !heightMatch) {
    return code
  }

  const width = Number.parseFloat(widthMatch[1])
  const height = Number.parseFloat(heightMatch[1])

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return code
  }

  const viewBox = `0 0 ${width} ${height}`

  return code.replace(/<svg\b([^>]*?)>/i, (_match, attrs) => {
    return `<svg${attrs} viewBox="${viewBox}">`
  })
}

export async function transformSvg({
  code,
  componentName,
  fixed = false,
}: TransformArgs) {
  const codeWithViewBox = ensureViewBox(code)

  return await transform(
    codeWithViewBox,
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
