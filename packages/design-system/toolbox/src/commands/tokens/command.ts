import fse from "fs-extra"
import path from "path"
import type { CSSProperties } from "react"
import { Node, PaintGradient, PaintType } from "../../figma"

import {
  FIGMA_FILE_ID,
  FONT_FAMILY_MONO,
  FONT_FAMILY_SANS,
} from "../../constants"
import { client } from "../../figma-client"
import { logger } from "../../logger"
import {
  colorToRGBA,
  createLinearGradientComponent,
  gradientValues,
} from "./utils/colors"
import { createDropShadowVariable } from "./utils/effects"

type GenerateTokensArgs = {
  output: string
}

type Tokens = {
  colors: {
    dark: Record<string, string>
    light: Record<string, string>
  }
  effects: {
    dark: Record<string, string>
    light: Record<string, string>
  }
  components: {
    dark: Record<string, CSSProperties>
    light: Record<string, CSSProperties>
  }
}

export async function generateTokens({ output }: GenerateTokensArgs) {
  logger.info("Fetching file styles")

  const res = await client.getFileStyles(FIGMA_FILE_ID).catch((err) => {
    logger.error(`Failed to fetch file styles: ${err.message}`)
    process.exit(1)
  })

  logger.success("Fetched file styles successfully")

  const colorNodeIds: string[] = []

  const textNodeIds: string[] = []

  const effectNodeIds: string[] = []

  res.meta?.styles.forEach((style) => {
    if (style.style_type === "FILL") {
      colorNodeIds.push(style.node_id)
    }

    if (style.style_type === "TEXT") {
      textNodeIds.push(style.node_id)
    }

    if (style.style_type === "EFFECT") {
      effectNodeIds.push(style.node_id)
    }
  })

  logger.info("Fetching file nodes")
  const [colorStyles, textStyles, effectStyles] = await Promise.all([
    client.getFileNodes<"RECTANGLE">(FIGMA_FILE_ID, {
      ids: colorNodeIds,
    }),
    client.getFileNodes(FIGMA_FILE_ID, {
      ids: textNodeIds,
    }),
    client.getFileNodes<"RECTANGLE">(FIGMA_FILE_ID, {
      ids: effectNodeIds,
    }),
  ])
    .catch((err) => {
      logger.error(`Failed to fetch file nodes: ${err.message}`)
      process.exit(1)
    })
    .finally(() => {
      logger.success("Fetched file nodes successfully")
    })

  const themeNode: Tokens = {
    colors: {
      dark: {},
      light: {},
    },
    effects: {
      dark: {},
      light: {},
    },
    components: {
      dark: {},
      light: {},
    },
  }

  const typo = Object.values(textStyles.nodes).reduce((acc, curr) => {
    if (!curr) {
      return acc
    }

    const node = curr.document as unknown as Node<"TEXT">

    const isText = node.name.startsWith("Text")

    if (isText) {
      const [_parent, identifier] = node.name.split("/")
      const { lineHeightPx, fontWeight, fontSize } = node.style

      const name = "." + identifier.toLowerCase().replace("text", "txt")

      const style: CSSProperties = {
        fontSize: `${fontSize / 16}rem`,
        lineHeight: `${lineHeightPx / 16}rem`,
        fontWeight: `${fontWeight}`,
        fontFamily: FONT_FAMILY_SANS.join(", "),
      }

      acc[name] = style

      return acc
    }

    const isHeader = node.name.startsWith("Headers")

    if (isHeader) {
      const [theme, identifier] = node.name.split("/")

      const formattedTheme = theme.toLowerCase().replace("headers ", "")
      const formattedIdentifier = identifier.toLowerCase()

      const name = "." + `${formattedIdentifier}-${formattedTheme}`

      const { lineHeightPx, fontSize, fontWeight } = node.style

      const style: CSSProperties = {
        fontSize: `${fontSize / 16}rem`,
        lineHeight: `${lineHeightPx / 16}rem`,
        fontWeight: `${fontWeight}`,
        fontFamily: FONT_FAMILY_SANS.join(", "),
      }

      acc[name] = style

      return acc
    }

    const isCodeBlock = node.name.startsWith("Code Block")

    if (isCodeBlock) {
      const [_parent, identifier] = node.name.split("/")

      const formattedIdentifier = "." + "code-" + identifier.toLowerCase()

      const { lineHeightPx, fontSize, fontWeight } = node.style

      const style: CSSProperties = {
        fontSize: `${fontSize / 16}rem`,
        lineHeight: `${lineHeightPx / 16}rem`,
        fontWeight: `${fontWeight}`,
        fontFamily: FONT_FAMILY_MONO.join(", "),
      }

      acc[formattedIdentifier] = style

      return acc
    }

    return acc
  }, {} as Record<string, CSSProperties>)

  const typoPath = path.join(output, "tokens", "typography.ts")

  logger.info(`Writing typography tokens to file`)
  await fse
    .outputFile(
      typoPath,
      `export const typography = ${JSON.stringify(typo, null, 2)}`
    )
    .then(() => {
      logger.success(`Typography tokens written to file successfully`)
    })
    .catch((err) => {
      logger.error(`Failed to write typography tokens to file: ${err.message}`)
      process.exit(1)
    })

  Object.values(colorStyles.nodes).reduce((acc, curr) => {
    if (!curr) {
      return acc
    }

    const [theme, _, variable] = curr.document.name.split("/")

    const lowerCaseTheme = theme.toLowerCase()

    if (lowerCaseTheme !== "light" && lowerCaseTheme !== "dark") {
      return acc
    }

    const fills = curr.document.fills

    const solid = fills.find((fill) => fill.type === "SOLID")
    const gradient = fills.find((fill) => fill.type === "GRADIENT_LINEAR")

    if (!solid && !gradient) {
      return acc
    }

    const solidVariable = `--${variable}`
    const gradientIdentifier = `${variable}-gradient`

    if (solid && solid.color) {
      acc["colors"][lowerCaseTheme][solidVariable] = colorToRGBA(
        solid.color,
        solid.opacity
      )
    }

    if (gradient) {
      const values = gradientValues(gradient as PaintGradient)

      if (values) {
        if (values.type === PaintType.GRADIENT_LINEAR) {
          const toVariable = `--${gradientIdentifier}-to`
          const fromVariable = `--${gradientIdentifier}-from`

          const component = createLinearGradientComponent({
            ...values,
            to: toVariable,
            from: fromVariable,
          })

          if (component) {
            acc["colors"][lowerCaseTheme][fromVariable] = values.from
            acc["colors"][lowerCaseTheme][toVariable] = values.to

            acc["components"][lowerCaseTheme][`.${gradientIdentifier}`] =
              component
          }
        } else {
          logger.warn(`Unsupported gradient type: ${values.type}`)
        }
      }
    }

    return acc
  }, themeNode)

  Object.values(effectStyles.nodes).reduce((acc, curr) => {
    if (!curr) {
      return acc
    }

    const [theme, type, variable] = curr.document.name.split("/")

    if (!type || !variable) {
      return acc
    }

    const lowerCaseTheme = theme.toLowerCase()
    const lowerCaseType = type.toLowerCase()

    if (lowerCaseTheme !== "light" && lowerCaseTheme !== "dark") {
      return acc
    }

    const effects = curr.document.effects

    if (!effects) {
      return acc
    }

    const identifier = `--${lowerCaseType}-${variable}`

    /**
     * Figma returns effects in reverse order
     * so we need to reverse them back to get the correct order
     */
    const reversedEffects = effects.reverse()

    const value = createDropShadowVariable(reversedEffects, identifier)

    if (!value) {
      return acc
    }

    acc["effects"][lowerCaseTheme][identifier] = value

    return acc
  }, themeNode)

  logger.info("Writing tokens to files")
  logger.info("Writing colors to file")

  const colorTokensPath = path.join(output, "tokens", "colors.ts")

  await fse
    .outputFile(
      colorTokensPath,
      `export const colors = ${JSON.stringify(themeNode.colors, null, 2)}`
    )
    .then(() => {
      logger.success("Wrote colors to file successfully")
    })
    .catch((err) => {
      logger.error(`Failed to write colors to file: ${err.message}`)
      process.exit(1)
    })

  logger.info("Writing effects to file")

  const effectTokensPath = path.join(output, "tokens", "effects.ts")
  await fse
    .outputFile(
      effectTokensPath,
      `export const effects = ${JSON.stringify(themeNode.effects, null, 2)}`
    )
    .then(() => {
      logger.success("Wrote effects to file successfully")
    })
    .catch((err) => {
      logger.error(`Failed to write effects to file: ${err.message}`)
      process.exit(1)
    })

  logger.info("Writing components to file")

  const componentTokensPath = path.join(output, "tokens", "components.ts")
  await fse
    .outputFile(
      componentTokensPath,
      `export const components = ${JSON.stringify(
        themeNode.components,
        null,
        2
      )}`
    )
    .then(() => {
      logger.success("Wrote components to file successfully")
    })
    .catch((err) => {
      logger.error(`Failed to write components to file: ${err.message}`)
      process.exit(1)
    })

  logger.success("Wrote tokens to files successfully")

  logger.info("Extending Tailwind config")

  const colorsExtension: Record<string, any> = {}

  Object.keys(themeNode.colors.light).reduce((acc, curr) => {
    const [prefix, style, state, context, ...others] =
      curr.split(/(?<=\w)-(?=\w)/)

    if (
      state === "gradient" ||
      context === "gradient" ||
      (others.length > 0 && others.includes("gradient"))
    ) {
      // We don't want to add gradients to the tailwind config, as they are added as components
      return acc
    }

    const fixedPrefix = prefix.replace("--", "")

    if (!acc[fixedPrefix]) {
      acc[fixedPrefix] = {}
    }

    if (!acc[fixedPrefix][style]) {
      acc[fixedPrefix][style] = {}
    }

    if (!state) {
      acc[fixedPrefix][style] = {
        ...acc[fixedPrefix][style],
        DEFAULT: `var(${curr})`,
      }

      return acc
    }

    if (!acc[fixedPrefix][style][state]) {
      acc[fixedPrefix][style][state] = {}
    }

    if (!context) {
      acc[fixedPrefix][style][state] = {
        ...acc[fixedPrefix][style][state],
        DEFAULT: `var(${curr})`,
      }

      return acc
    }

    if (context === "gradient") {
      // We don't want to add gradients to the tailwind config, as they are added as components
      return acc
    }

    if (!acc[fixedPrefix][style][state][context]) {
      acc[fixedPrefix][style][state][context] = {}
    }

    acc[fixedPrefix][style][state][context] = {
      ...acc[fixedPrefix][style][state][context],
      DEFAULT: `var(${curr})`,
    }

    return acc
  }, colorsExtension)

  const boxShadowExtension: Record<string, any> = {}

  Object.keys(themeNode.effects.light).reduce((acc, curr) => {
    const key = `${curr.replace("--", "")}`

    acc[key] = `var(${curr})`

    return acc
  }, boxShadowExtension)

  const themeExtension = {
    extend: {
      colors: {
        ui: colorsExtension,
      },
      boxShadow: boxShadowExtension,
    },
  }

  const tailwindConfigPath = path.join(output, "extension", "theme.ts")
  await fse
    .outputFile(
      tailwindConfigPath,
      `export const theme = ${JSON.stringify(themeExtension, null, 2)}`
    )
    .then(() => {
      logger.success("Wrote Tailwind config extension successfully")
    })
    .catch((err) => {
      logger.error(`Failed to write Tailwind config extension: ${err.message}`)
      process.exit(1)
    })

  logger.success("Extended Tailwind config successfully")

  // TODO: Add text styles
}
