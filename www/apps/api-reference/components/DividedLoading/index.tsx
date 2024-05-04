import DividedLayout from "@/layouts/Divided"
import { Loading } from "docs-ui"

type DividedLoadingProps = {
  className?: string
}

const DividedLoading = ({ className }: DividedLoadingProps) => {
  return (
    <DividedLayout
      mainContent={
        <>
          <Loading count={1} className="mb-2 !w-1/3" />
          <Loading count={1} />
          <div className="flex gap-1">
            <Loading count={1} className="!w-1/3" />
            <Loading count={1} className="!w-2/3" />
          </div>
          <div className="flex gap-1">
            <Loading count={1} className="!w-1/3" />
            <Loading count={1} className="!w-2/3" />
          </div>
          <Loading count={1} className="mt-2 !w-1/3" />
          <Loading count={1} />
          <div className="mt-2 flex gap-1">
            <Loading count={1} className="!w-1/3" />
            <Loading count={1} className="!w-2/3" />
          </div>
          <div className="flex gap-1">
            <Loading count={1} className="!w-1/3" />
            <Loading count={1} className="!w-2/3" />
          </div>
          <div className="flex gap-1">
            <Loading count={1} className="!w-1/3" />
            <Loading count={1} className="!w-2/3" />
          </div>
          <Loading count={5} barClassName="mt-1" />
        </>
      }
      codeContent={
        <>
          <Loading count={1} />
          <Loading count={1} className="my-2" />
          <Loading count={1} barClassName="h-[200px] !rounded-sm" />
          <Loading count={1} className="my-2" />
          <Loading count={1} barClassName="h-3 !rounded-sm" />
          <Loading count={1} barClassName="h-[230px] !rounded-sm" />
        </>
      }
      className={className}
    />
  )
}

export default DividedLoading
