import React, { useEffect } from "react"
import { globalHistory } from "@reach/router"

const AnchorLink = ({ to, children }) => {
  // useEffect(() => {
  //   globalHistory.listen(({ location }) => {
  //     console.log(location)
  //   })
  //   console.log("RERENDER")
  // }, [])
  // return <div>listening</div>
}

export default AnchorLink
