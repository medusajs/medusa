"use client"

import React from "react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

type ZoomImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

export const ZoomImg = (props: ZoomImgProps) => {
  return (
    <Zoom wrapElement="span">
      <img {...props} />
    </Zoom>
  )
}
