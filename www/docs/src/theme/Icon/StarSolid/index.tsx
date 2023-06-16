import React from "react"
import { IconProps } from ".."

const IconStarSolid: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.99002 2.67496C9.36336 1.77746 10.6367 1.77746 11.01 2.67496L12.745 6.84746L17.2484 7.20829C18.2184 7.28579 18.6117 8.49579 17.8725 9.12912L14.4417 12.0683L15.4892 16.4625C15.715 17.4091 14.6859 18.1566 13.8559 17.65L10 15.295L6.14419 17.65C5.31419 18.1566 4.28502 17.4083 4.51086 16.4625L5.55836 12.0683L2.12752 9.12912C1.38836 8.49579 1.78169 7.28579 2.75169 7.20829L7.25502 6.84746L8.99002 2.67579V2.67496Z"
        className={
          iconColorClassName ||
          "tw-fill-medusa-icon-subtle dark:tw-fill-medusa-icon-subtle"
        }
      />
    </svg>
  )
}

export default IconStarSolid
