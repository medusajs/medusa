import React from "react"
import { Flex, Box } from "theme-ui"
import Sidebar from "./sidebar"

const Layout = ({ data, api, children }) => {
  // const [visible, setVisible] = useState(false)

  //SEARCH ON CMD/CTRL + F
  // useEffect(() => {
  //   function handleKeyPress(e) {
  //     if (!visible && e.metaKey && e.key === "f") {
  //       e.preventDefault()
  //       setVisible(true)
  //     } else if (visible && e.metaKey && e.key === "f") {
  //       e.preventDefault()
  //       setVisible(false)
  //     }
  //   }
  //   window.addEventListener("keydown", handleKeyPress)
  //   return () => window.removeEventListener("keydown", handleKeyPress)
  // }, [visible])

  return (
    <Flex sx={{ p: "0", m: "0", overflow: "hidden" }}>
      {/* IMPLEMENT: Algolia Docsearch */}
      {/* <Flex
        sx={{
          display: visible ? "flex" : "none",
        }}
      ></Flex> */}
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "scroll",
          fontFamily: "body",
          flexGrow: "1",
        }}
      >
        <Sidebar data={data} api={api} />
        <Box>{children}</Box>
      </Flex>
    </Flex>
  )
}

export default Layout
