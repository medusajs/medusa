import React, { useContext } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import { AccountContext } from "../context/account"
import { isBrowser } from "../utils/is-browser"

const IndexPage = () => {
  return (
    <Layout>
      <Navigate to="/admin" />
    </Layout>
  )
}

export default IndexPage
