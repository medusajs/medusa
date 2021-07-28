import React, { useEffect, useState } from "react"
import Select from "../../../select"
import { navigate } from "gatsby-link"
import styled from "@emotion/styled"

const StyledSelect = styled(Select)`
  width: 100%;
  padding-bottom: 0;
  select {
    flex-grow: 1;
  }
`

const SideBarSelector = () => {
  const [api, setApi] = useState(null)
  const options = [
    { value: "admin", label: "Admin" },
    { value: "store", label: "Storefront" },
  ]

  useEffect(() => {
    const pathname = window.location.pathname
    const matches = pathname.match(/api\/(store|admin)/)
    if (pathname.length > 1) {
      setApi(options.find(opt => opt.value === matches[1]))
    }
  }, [])

  console.log(api)
  return (
    <StyledSelect
      defaultValue={api}
      onChange={e => navigate(`/api/${e.target.value}`)}
      options={options}
    />
  )
}

export default SideBarSelector
