import { client } from "@/figma-client"
import fse from "fs-extra"
import { resolve } from "path"

import { generateIndex, getIconData } from "@/commands/icons/utils"
import { transformSvg } from "@/transformers"

import { FIGMA_FILE_ID, FIGMA_ICONS_NODE_ID } from "@/constants"
import { logger } from "@/logger"

type GenerateIconsArgs = {
  output: string
}

// We don't want to generate icons for these frames as they are not optimized
const BANNED_FRAMES = ["Flags"]

export async function generateIcons({ output }: GenerateIconsArgs) {
  const skippedIcons: string[] = []

  // Ensure the destination directory exists
  await fse.mkdirp(output)

  logger.info("Fetching components from Figma")

  const fileComponents = await client
    .getFileComponents(FIGMA_FILE_ID)
    .then((file) => {
      logger.success("Successfully fetched components from Figma")
      return file
    })
    .catch((_error) => {
      logger.error("Failed to fetch components from Figma")
      return null
    })

  if (!fileComponents) {
    return
  }

  logger.info("Fetching URLs for SVGs")

  const iconNodes = fileComponents.meta?.components.reduce((acc, component) => {
    const frameInfo = component.containing_frame

    if (!frameInfo) {
      return acc
    }

    if (BANNED_FRAMES.includes(frameInfo.name)) {
      return acc
    }

    if (frameInfo.pageId !== FIGMA_ICONS_NODE_ID) {
      return acc
    }

    acc.push({
      node_id: component.node_id,
      name: component.name,
      frame_name: frameInfo.name,
    })

    return acc
  }, [] as { node_id: string; name: string; frame_name: string }[])

  if (!iconNodes) {
    logger.error(
      "Found no SVGs to export. Make sure that the Figma file is correct."
    )
    return
  }

  const URLData = await client.getImage(FIGMA_FILE_ID, {
    ids: iconNodes.map((icon) => icon.node_id),
    format: "svg",
    scale: 1,
  })

  logger.success("Successfully fetched URLs for SVGs")

  const length = iconNodes.length

  logger.info("Transforming SVGs")
  for (let i = 0; i < length; i += 20) {
    const slice = iconNodes.slice(i, i + 20)

    const requests = slice.map(async (icon) => {
      const URL = URLData.images[icon.node_id]

      if (!URL) {
        logger.warn(`Failed to fetch icon ${icon.name}. Skipping...`)
        skippedIcons.push(icon.name)
        return
      }

      let code: string | null = null

      try {
        code = await client.getResource(URL)
      } catch (e) {
        logger.warn(`Failed to fetch icon ${icon.name}. Skipping...`)
        skippedIcons.push(icon.name)
      }

      if (!code) {
        return
      }

      const { componentName, fileName, fixed } = getIconData(
        icon.name,
        icon.frame_name
      )

      const component = await transformSvg({
        code,
        componentName,
        fixed,
      })

      const filePath = resolve(output, fileName)

      await fse.outputFile(filePath, component)
    })

    await Promise.all(requests)
  }
  logger.success("Successfully transformed SVGs")

  if (skippedIcons.length) {
    logger.warn(
      `Skipped ${skippedIcons.length} icons. Check the logs for more information.`
    )
  }

  logger.info("Generating index file")

  await generateIndex(output)

  logger.success("Successfully generated index file")

  logger.success(`Successfully generated ${length} icons ✨`)
}
