import clsx from "clsx"
import Feedback from "../../Feedback"
import EditButton from "../../EditButton"

const HomepageFooter = () => {
  return (
    <div className="py-4 w-full">
      <div
        className={clsx(
          "flex flex-col lg:flex-row gap-2 justify-between lg:items-center",
          "xl:mx-auto xl:max-w-[1136px] w-full px-1 sm:px-4 xl:px-0"
        )}
      >
        <Feedback
          showDottedSeparator={false}
          question="Was this page helpful?"
        />
        <EditButton />
      </div>
    </div>
  )
}

export default HomepageFooter
