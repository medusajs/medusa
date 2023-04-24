import React from "react"
import Manage from "./manage"
import { Route, Routes } from "react-router-dom"

const PayoutsIndex = () => (
  <Routes>
    <Route path="/manage/:type" element={<Manage />} />
  </Routes>
)

export default PayoutsIndex
