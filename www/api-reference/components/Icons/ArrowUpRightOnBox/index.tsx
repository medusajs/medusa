import type IconProps from "../types"

const IconArrowUpRightOnBox = ({ iconColorClassName, ...props }: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.55356 5.32683H5.24268C4.7779 5.32683 4.33216 5.51146 4.00351 5.84011C3.67487 6.16875 3.49023 6.6145 3.49023 7.07927V15.2574C3.49023 15.7221 3.67487 16.1679 4.00351 16.4965C4.33216 16.8252 4.7779 17.0098 5.24268 17.0098H13.4208C13.8855 17.0098 14.3313 16.8252 14.6599 16.4965C14.9886 16.1679 15.1732 15.7221 15.1732 15.2574V11.0207M7.50323 13.0137L17.5098 2.99023M17.5098 2.99023H13.4208M17.5098 2.99023V7.07927"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          iconColorClassName ||
          "stroke-medusa-fg-subtle dark:stroke-medusa-fg-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconArrowUpRightOnBox
