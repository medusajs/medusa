import React from "react"
import { Route, Routes } from "react-router-dom"
import Navigation from "./navigation"
import Posts from "./posts"
import { PostType } from "../../types/shared"

const ContentIndex = () => (
  <Routes>
    <Route path="/pages/*" element={<Posts type={PostType.PAGE} />} />
    <Route path="/posts/*" element={<Posts type={PostType.POST} />} />
    <Route path="/navigation/*" element={<Navigation />} />
  </Routes>
)

export default ContentIndex
