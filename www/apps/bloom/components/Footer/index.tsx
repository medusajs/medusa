"use client"

import { Footer as UiFooter } from "docs-ui"
import Feedback from "../Feedback"
import EditButton from "../EditButton"

const Footer = () => {
  return (
    <UiFooter
      showPagination={true}
      feedbackComponent={<Feedback className="my-2" />}
      editComponent={<EditButton />}
    />
  )
}

export default Footer
