import Feedback from "../../Feedback"

const HomepageFooter = () => {
  return (
    <div className="p-2 w-full">
      <Feedback
        showDottedSeparator={false}
        question="Was this page helpful?"
        questionClassName="!text-medusa-fg-subtle"
      />
    </div>
  )
}

export default HomepageFooter
