import { PropsWithChildren } from "react"
import { Toaster } from "react-hot-toast"

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Toaster
        containerStyle={{
          top: 24,
          left: 24,
          bottom: 24,
          right: 24,
        }}
        position="bottom-right"
      />
      <div className="mb-large">
        <Logo />
      </div>
      {children}
    </div>
  )
}

const Logo = () => {
  return (
    <div className="w-5xlarge h-5xlarge flex items-center justify-center rounded-full bg-gradient-to-t from-[#26292B] via-[#151718] to-[#151718]">
      <SVG />
    </div>
  )
}

const SVG = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.4895 7.84367L24.3377 3.15373C21.6705 1.61542 18.4022 1.61542 15.7351 3.15373L7.5457 7.84367C4.91608 9.38197 3.26318 12.2335 3.26318 15.2725V24.6899C3.26318 27.7665 4.91608 30.5805 7.5457 32.1188L15.6975 36.8463C18.3647 38.3846 21.6329 38.3846 24.3001 36.8463L32.4519 32.1188C35.1191 30.5805 36.7344 27.7665 36.7344 24.6899V15.2725C36.8095 12.2335 35.1566 9.38197 32.4895 7.84367ZM20.0176 28.3669C15.397 28.3669 11.6404 24.6149 11.6404 20C11.6404 15.3851 15.397 11.6331 20.0176 11.6331C24.6382 11.6331 28.4323 15.3851 28.4323 20C28.4323 24.6149 24.6758 28.3669 20.0176 28.3669Z"
        fill="url(#paint0_linear_7693_9181)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_7693_9181"
          x1="20"
          y1="2"
          x2="20"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default PublicLayout
