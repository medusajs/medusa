import { PropsWithChildren } from "react"

/**
 * Layout for public pages such as login, register, etc.
 * @param children
 */
const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#7C53FF] to-[#F796FF]">
      <div></div>
      <div className="text-grey-0 inter-base-regular pb-12">
        © Medusa Commerce <span>&#183;</span>{" "}
        <a
          style={{ color: "inherit", textDecoration: "none" }}
          href="mailto:hello@medusajs.com"
        >
          Contact
        </a>
      </div>
    </div>
  )
}

export default PublicLayout
