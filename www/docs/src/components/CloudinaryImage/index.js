import React from "react"
import { useThemeConfig } from '@docusaurus/theme-common'
import { Cloudinary } from "@cloudinary/url-gen";
import MDXImg from '@theme/MDXComponents/Img';
import { pad, imaggaScale, imaggaCrop, crop, fit, minimumPad, fill, scale, limitFit, thumbnail, limitFill, minimumFit, limitPad, fillPad } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";

const resizeActions = {
  'pad': pad,
  'imaggaScale': imaggaScale,
  'imaggaCrop': imaggaCrop,
  'crop': crop,
  'fit': fit,
  'minimumPad': minimumPad,
  'fill': fill,
  'scale': scale,
  'limitFit': limitFit,
  'thumbnail': thumbnail,
  'limitFill': limitFill,
  'minimumFit': minimumFit,
  'limitPad': limitPad,
  'fillPad': fillPad
}

const imageRegex = /^https:\/\/res.cloudinary.com\/.*\/upload\/v[0-9]+\/(?<imageId>.*)$/

export default function CloudinaryImage ({ src, ...props }) {
  const { cloudinaryConfig } = useThemeConfig();
  const matchingRegex = src.match(imageRegex)
  if (!cloudinaryConfig || !matchingRegex?.groups || !matchingRegex.groups.imageId) {
    // either cloudinary isn't configured or
    // could not match url to a cloudinary url
    // default to docusaurus's image component
    return <MDXImg src={src} {...props} />
  }

  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: cloudinaryConfig.cloudName
    }
  });
  let image = cloudinary.image(matchingRegex.groups.imageId.replaceAll('%20', ' '))

  cloudinaryConfig.flags?.forEach((flag) => image.addTransformation(flag))

  if (cloudinaryConfig.roundCorners) {
    image.roundCorners(byRadius(cloudinaryConfig.roundCorners))
  }
  if (cloudinaryConfig.resize) {
    const action = resizeActions[cloudinaryConfig.resize.action]
    let resizeAction = action()
    if (props.width || props.height) {
      if (props.width) {
        resizeAction = resizeAction.width(props.width)
      }

      if (props.height) {
        resizeAction = resizeAction.height(props.height)
      }
    } else if (cloudinaryConfig.resize.aspectRatio) {
      resizeAction = resizeAction.aspectRatio(cloudinaryConfig.resize.aspectRatio)
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

  return (
    <p className="cloudinary-image-wrapper">
      <MDXImg {...props} src={image.toURL()} />
    </p>
  )
}