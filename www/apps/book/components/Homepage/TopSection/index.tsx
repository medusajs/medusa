/* eslint-disable @next/next/no-img-element */
import clsx from "clsx"
import { BookIcon, Card, IconHeadline, WindowPaintbrushIcon } from "docs-ui"
import { basePathUrl } from "../../../utils/base-path-url"
import HomepageCodeTabs from "../CodeTabs"

const HomepageTopSection = () => {
  return (
    <div className="w-full relative">
      <div
        className={clsx(
          "absolute h-full",
          "left-0 top-0 w-full z-0 lg:hidden bg-contain bg-right-bottom bg-no-repeat"
        )}
        style={{
          backgroundImage: `url(${basePathUrl(
            "/images/get-started-card-md.png"
          )})`,
        }}
      />
      <div
        className={clsx(
          "absolute h-full lg:h-[calc(50%-32px)] border-b border-medusa-border-base",
          "left-0 top-0 w-full z-1 bg-cover bg-repeat",
          "bg-bg-stripes dark:bg-bg-stripes-dark"
        )}
      />
      <div
        className={clsx(
          "w-fit mx-auto lg:grid lg:grid-cols-2 lg:grid-rows-2",
          "xl:grid-cols-[336px_752px] lg:grid-cols-[25%_75%] lg:gap-x-4",
          "2xl:pl-[184px] lg:pb-4 2xl:pr-[176px] z-[2] relative",
          "xs:px-4 xs:pb-4 px-1 pb-8",
          "flex justify-center items-start"
        )}
      >
        <div className="flex flex-col gap-1.5 pt-1 xs:pt-4 lg:py-4">
          <div className="flex flex-col gap-[10px]">
            <IconHeadline title="Documentation" icon={<BookIcon />} />
            <h2 className="text-medusa-fg-base text-h1 text-pretty w-full md:w-2/3 lg:w-full">
              Learn how to build Medusa projects. Explore our guides.
            </h2>
          </div>
          <Card
            type="mini"
            title="Get started"
            text="Introduction"
            themeImage={{
              light: basePathUrl("/images/get-started-card.png"),
              dark: basePathUrl("/images/get-started-card-dark.png"),
            }}
            href={"/learn"}
          />
        </div>
        <HomepageCodeTabs />
        <div className="pt-4 hidden lg:flex flex-col gap-0.5">
          <IconHeadline
            title="Optimized for Customizations"
            icon={<WindowPaintbrushIcon />}
          />
          <h2 className="text-medusa-fg-base text-h1 text-pretty">
            A digital commerce platform with a built-in framework for
            customizations.
          </h2>
          <span className="text-small-plus text-medusa-fg-subtle">
            Unlike other platforms, Medusa allows you to easily customize and
            extend the behavior of your commerce platform to always fit your
            business needs.
          </span>
        </div>
      </div>
    </div>
  )
}

export default HomepageTopSection
