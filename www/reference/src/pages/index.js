import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { Helmet } from "react-helmet"
import { Flex } from "rebass"

import Layout from "../components/new/components/layout"
import Sidebar from "../components/new/components/sidebar"
import Content from "../components/new/components/content"

export default function Home({ data }) {
  useEffect(() => {
    navigate("/api/store")
  })

  return <div>Redirecting...</div>
}
