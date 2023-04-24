import React from "react"
import { Route, Routes } from "react-router-dom"
import Preview from "./preview"

const EmailIndex = () => (
  <Routes>
    <Route path="/preview" element={<Preview />} />
  </Routes>
)

export default EmailIndex
