import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonOrderInformation = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10 border-b border-gray-200">
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-gray-100 mb-4"></div>
          <div className="w-2/6 h-3 bg-gray-100"></div>
          <div className="w-3/6 h-3 bg-gray-100 my-2"></div>
          <div className="w-1/6 h-3 bg-gray-100"></div>
        </div>
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-gray-100 mb-4"></div>
          <div className="w-2/6 h-3 bg-gray-100"></div>
          <div className="w-3/6 h-3 bg-gray-100 my-2"></div>
          <div className="w-2/6 h-3 bg-gray-100"></div>
          <div className="w-1/6 h-3 bg-gray-100 mt-2"></div>
          <div className="w-32 h-4 bg-gray-100 my-4"></div>
          <div className="w-1/6 h-3 bg-gray-100"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10">
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-gray-100 mb-4"></div>
          <div className="w-2/6 h-3 bg-gray-100"></div>
          <div className="w-3/6 h-3 bg-gray-100 my-4"></div>
        </div>

        <SkeletonCartTotals />
      </div>
    </div>
  )
}

export default SkeletonOrderInformation
