import React from "react"

type GridInputProps = React.InputHTMLAttributes<HTMLInputElement>

const GridInput: React.FC<GridInputProps> = ({ value, ...props }) => {
  return (
    <input
      className="leading-base rounded-rounded inter-small-regular placeholder:text-grey-40 focus-within:shadow-input focus-within:border-violet-60 h-full w-full border border-transparent bg-transparent py-4 px-2 outline-none outline-0 focus-within:border"
      value={value}
      {...props}
    />
  )
}

export default GridInput
