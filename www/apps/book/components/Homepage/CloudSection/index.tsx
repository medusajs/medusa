import clsx from "clsx"
import { HeadlineTags } from "docs-ui"
import CloudSectionHeroIllustration from "./Illustrations/hero"
import HomepageCloudTabs from "./Tabs"

const HomepageCloudSection = () => {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-0 justify-center border-b border-medusa-border-base">
        <div
          className={clsx(
            "w-full md:w-1/2 lg:w-1/3 bg-medusa-bg-component p-2 flex justify-center items-center",
            "md:border-r border-medusa-border-base",
            "border-b md:border-b-0"
          )}
        >
          <CloudSectionHeroIllustration className="w-full max-w-[280px] h-auto" />
        </div>
        <div
          className={clsx(
            "w-full md:w-1/2 lg:w-2/3 py-4 px-2",
            "flex flex-col gap-0.75 justify-center"
          )}
        >
          <HeadlineTags
            tags={[
              "Medusa Cloud",
              {
                text: "Learn more",
                link: "https://docs.medusajs.com/cloud",
              },
            ]}
            className="!justify-start"
          />
          <h2 className="text-h1 text-medusa-fg-base lg:max-w-[450px]">
            Everything your store needs to go live, managed for you.
          </h2>
          <p className="txt-large text-medusa-fg-base">
            Explore the features and resources that come with a Medusa Cloud
            project.
          </p>
        </div>
      </div>
      <HomepageCloudTabs />
    </>
  )
}

export default HomepageCloudSection
