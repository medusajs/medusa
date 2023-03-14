const LoginLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid min-h-screen grid-cols-1 grid-rows-1">
        <div
          className="flex flex-col items-center"
          style={{
            background: "linear-gradient(73.29deg, #7C53FF 0%, #F796FF 100%)",
          }}
        >
          {children}
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
      </div>
    </div>
  )
}

export default LoginLayout
