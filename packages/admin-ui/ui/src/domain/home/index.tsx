import React from "react"
import { Route, Routes } from "react-router-dom"

import BodyCard from "../../components/organisms/body-card"

const HomeIndex: React.FC<{}> = () => {
  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard></BodyCard>
      </div>
    </div>
  )
}

const Home = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeIndex />} />
    </Routes>
  )
}

export default Home
