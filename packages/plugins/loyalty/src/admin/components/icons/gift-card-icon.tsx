import { ComponentProps } from "react";

const GiftCardIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="15" height="15" fill="#F97316" />
      <rect
        width="15"
        height="15"
        fill="url(#paint0_linear_28788_25808)"
        fillOpacity="0.2"
      />
      <g clipPath="url(#clip0_28788_25808)">
        <path
          d="M7.5 6.375H5.375C4.479 6.375 3.75 5.618 3.75 4.688C3.75 3.757 4.479 3 5.375 3C7.365 3 8.019 5.569 8.047 5.678C8.088 5.846 8.05 6.023 7.943 6.16C7.836 6.296 7.673 6.375 7.5 6.375ZM5.375 4.125C5.099 4.125 4.875 4.377 4.875 4.688C4.875 4.998 5.099 5.25 5.375 5.25H6.688C6.439 4.736 6.011 4.125 5.375 4.125Z"
          fill="white"
        />
        <path
          d="M9.625 6.375H7.5C7.328 6.375 7.164 6.296 7.058 6.16C6.95 6.023 6.913 5.846 6.953 5.678C6.98 5.569 7.634 3 9.625 3C10.521 3 11.25 3.757 11.25 4.688C11.25 5.618 10.521 6.375 9.625 6.375ZM8.312 5.25H9.625C9.901 5.25 10.125 4.998 10.125 4.688C10.125 4.377 9.901 4.125 9.625 4.125C8.99 4.125 8.561 4.736 8.312 5.25Z"
          fill="white"
        />
        <path
          d="M11.438 6.375H3.562C3.252 6.375 3 6.123 3 5.813C3 5.502 3.252 5.25 3.562 5.25H11.438C11.748 5.25 12 5.502 12 5.813C12 6.123 11.748 6.375 11.438 6.375Z"
          fill="white"
        />
        <path
          d="M6.938 7.5H3.75V9.563C3.75 10.7 4.675 11.625 5.813 11.625H6.938V7.5Z"
          fill="white"
        />
        <path
          d="M8.063 7.5V11.625H9.188C10.325 11.625 11.25 10.7 11.25 9.563V7.5H8.063Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_28788_25808"
          x1="7.5"
          y1="0"
          x2="7.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_28788_25808">
          <rect width="9" height="9" fill="white" transform="translate(3 3)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GiftCardIcon;
