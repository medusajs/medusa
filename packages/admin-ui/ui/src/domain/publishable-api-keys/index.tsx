import { Route, Routes } from "react-router-dom"

import Index from "./pages"

const PublishableApiKeysRoute = () => {
  return (
    <Routes>
      <Route index element={<Index />} />
    </Routes>
  )
}

export default PublishableApiKeysRoute
