import type { Metadata } from "next"
import Link from "next/link"
import { CardList, MDXComponents } from "docs-ui"
import {
  BookOpen,
  AcademicCapSolid,
  ComputerDesktopSolid,
  BuildingStorefront,
} from "@medusajs/icons"

const H1 = MDXComponents.h1!
const P = MDXComponents.p!

export const metadata: Metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return (
    <div>
      <H1>Page Not Found</H1>
      <P>The page you were looking for isn&apos;t available.</P>
      <P>
        If you think this is a mistake, please
        <Link href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml">
          report this issue on GitHub
        </Link>
      </P>
      <CardList
        itemsPerRow={2}
        items={[
          {
            title: "Get Started Docs",
            href: "/",
            icon: BookOpen,
          },
          {
            title: "Development Resources",
            href: "!resources!",
            icon: AcademicCapSolid,
          },
          {
            title: "Admin API reference",
            href: "!api!/admin",
            icon: ComputerDesktopSolid,
          },
          {
            title: "Store API reference",
            href: "!api!/store",
            icon: BuildingStorefront,
          },
        ]}
      />
    </div>
  )
}
