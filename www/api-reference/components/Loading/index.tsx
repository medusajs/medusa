const Loading = () => {
  return (
    <span
      role="status"
      className="my-1 flex w-full animate-pulse flex-col gap-1"
    >
      <span className=" h-1 w-full rounded-full bg-[#d1d5db] dark:bg-[#504F57]"></span>
      <span className=" h-1 w-full rounded-full bg-[#d1d5db] dark:bg-[#504F57]"></span>
      <span className=" h-1 w-full rounded-full bg-[#d1d5db] dark:bg-[#504F57]"></span>
      <span className=" h-1 w-full rounded-full bg-[#d1d5db] dark:bg-[#504F57]"></span>
      <span className=" h-1 w-full rounded-full bg-[#d1d5db] dark:bg-[#504F57]"></span>
      <span className=" h-1 w-full rounded-full bg-[#d1d5db] dark:bg-[#504F57]"></span>
      <span className="sr-only">Loading...</span>
    </span>
  )
}

export default Loading
