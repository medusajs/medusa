import React from "react"

type GridInputProps = React.InputHTMLAttributes<HTMLInputElement>

const GridInput: React.FC<GridInputProps> = ({ value, ...props }) => {
  return (
    <input
      className="outline-none outline-0 leading-base bg-transparent py-4 px-2 w-full h-full border rounded-rounded border-transparent inter-small-regular placeholder:text-grey-40 focus-within:shadow-input focus-within:border focus-within:border-violet-60"
      value={value}
      {...props}
    />
  )
}

export default GridInput
