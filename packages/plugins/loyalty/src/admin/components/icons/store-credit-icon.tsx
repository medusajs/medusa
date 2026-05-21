import { ComponentProps } from "react";

const StoreCreditIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="15" height="15" fill="#8B5CF6" />
      <rect
        width="15"
        height="15"
        fill="url(#paint0_linear_29181_44790)"
        fillOpacity="0.2"
      />
      <path
        d="M12 6V5.813C12 4.675 11.075 3.75 9.938 3.75H5.063C3.925 3.75 3 4.675 3 5.813V6H12Z"
        fill="white"
      />
      <path
        d="M3 7.125V9.188C3 10.325 3.925 11.25 5.063 11.25H9.938C11.075 11.25 12 10.325 12 9.188V7.125H3ZM9.938 9.75H8.438C8.127 9.75 7.875 9.498 7.875 9.188C7.875 8.877 8.127 8.625 8.438 8.625H9.938C10.248 8.625 10.5 8.877 10.5 9.188C10.5 9.498 10.248 9.75 9.938 9.75Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_29181_44790"
          x1="7.5"
          y1="0"
          x2="7.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default StoreCreditIcon;
