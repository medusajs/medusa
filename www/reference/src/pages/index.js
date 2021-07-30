import React, { useEffect } from "react"
import { navigate } from "gatsby"

export default function Home({ data }) {
  useEffect(() => {
    navigate("/api/store")
  })

  return <div>Redirecting...</div>
}
