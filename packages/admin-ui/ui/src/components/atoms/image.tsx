import type { DOMAttributes } from "react"
import { imageProxyURL, ImageProxyURLOptions } from "../../utils/img-proxy"
import ImagePlaceholder from "../fundamentals/image-placeholder"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  proxyOptions?: ImageProxyURLOptions
}

export const Image = ({
  src,
  alt,
  className,
  proxyOptions,
  ...props
}: ImageProps) => {
  if (!src) return <ImagePlaceholder />

  const proxySrc = src?.startsWith("http")
    ? imageProxyURL(src, proxyOptions)
    : src

  return <img src={proxySrc} alt={alt} className={className} {...props} />
}
