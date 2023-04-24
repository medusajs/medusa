import React from "react"

const Route = ({
  component: Component,
  location,
  ...rest
}: {
  location?: any | undefined
  component: any
  [key: string]: any
}) => <Component {...rest} />
export default Route
