import { HeadlineTags, ShadedBlock } from "docs-ui"

const HomepageTopSection = () => {
  return (
    <div className="w-full py-4 px-2 flex flex-col gap-0.75 justify-center items-center">
      <HeadlineTags
        tags={[
          "Medusa Documentation",
          {
            text: "Introduction",
            link: "/learn",
          },
        ]}
      />
      <div className="flex-col gap-0.75 justify-center items-center hidden md:flex">
        <h2 className="text-display text-center">
          Learn how to build Medusa projects.
        </h2>
        <div className="flex gap-1 w-full items-center">
          <ShadedBlock className="w-full min-h-[44px]" />
          <h2 className="text-display min-w-max">Explore our guides.</h2>
        </div>
      </div>
      <div className="flex flex-col gap-0.75 justify-center items-center md:hidden">
        <h2 className="text-display text-center">
          Learn how to build Medusa projects. Explore our guides.
        </h2>
        <ShadedBlock className="w-full min-h-[44px]" />
      </div>
    </div>
  )
}

export default HomepageTopSection
