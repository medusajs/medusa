import type { Transformer } from "unified"
import type { CloudinaryConfig, UnistNode, UnistTree } from "./types/index.js"

const cloudinaryImageRegex =
  /^https:\/\/res.cloudinary.com\/.*\/upload\/v[0-9]+\/(?<imageId>.*)$/

export function cloudinaryImgRehypePlugin({
  cloudinaryConfig,
}: {
  cloudinaryConfig: CloudinaryConfig
}): Transformer {
  return async (tree) => {
    if (!cloudinaryConfig) {
      return
    }
    const { visit } = await import("unist-util-visit")
    const { Cloudinary } = await import("@cloudinary/url-gen")
    const { byRadius } = await import(
      "@cloudinary/url-gen/actions/roundCorners"
    )

    const {
      pad,
      imaggaScale,
      imaggaCrop,
      crop,
      fit,
      minimumPad,
      fill,
      scale,
      limitFit,
      thumbnail,
      limitFill,
      minimumFit,
      limitPad,
      fillPad,
    } = await import("@cloudinary/url-gen/actions/resize")

    const resizeActions = {
      pad,
      imaggaScale,
      imaggaCrop,
      crop,
      fit,
      minimumPad,
      fill,
      scale,
      limitFit,
      thumbnail,
      limitFill,
      minimumFit,
      limitPad,
      fillPad,
    }

    visit(tree as UnistTree, (node: UnistNode) => {
      const matchingRegex = node.properties?.src?.match(cloudinaryImageRegex)

      if (node.tagName !== "img" || !matchingRegex?.groups?.imageId) {
        return
      }

      const cloudinary = new Cloudinary({
        cloud: {
          cloudName: cloudinaryConfig.cloudName,
        },
      })
      const image = cloudinary.image(
        matchingRegex.groups.imageId.replaceAll("%20", " ")
      )

      cloudinaryConfig.flags?.forEach((flag) => image.addTransformation(flag))

      if (cloudinaryConfig.roundCorners) {
        image.roundCorners(byRadius(cloudinaryConfig.roundCorners))
      }

      if (cloudinaryConfig.resize) {
        const action =
          resizeActions[
            cloudinaryConfig.resize.action as keyof typeof resizeActions
          ]
        let resizeAction = action()
        if (node.properties?.width || node.properties?.height) {
          if (node.properties?.width) {
            resizeAction = resizeAction.width(node.properties.width)
          }

          if (node.properties?.height) {
            resizeAction = resizeAction.height(node.properties.height)
          }
        } else if (cloudinaryConfig.resize.aspectRatio) {
          resizeAction = resizeAction.aspectRatio(
            cloudinaryConfig.resize.aspectRatio
          )
        } else {
          if (cloudinaryConfig.resize.width) {
            resizeAction = resizeAction.width(cloudinaryConfig.resize.width)
          }

          if (cloudinaryConfig.resize.height) {
            resizeAction = resizeAction.height(cloudinaryConfig.resize.height)
          }
        }

        image.resize(resizeAction)
      }

      node.properties!.src = image.toURL()
    })
  }
}
