import React, { FC, ImgHTMLAttributes } from "react"
import unis from "../../../images/unis.png"

export const UniscoLogo: FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return <img {...props} src={unis} />
}
