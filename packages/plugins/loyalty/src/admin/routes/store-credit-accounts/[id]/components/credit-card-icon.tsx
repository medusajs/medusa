const CreditCardIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="40"
      height="30"
      viewBox="0 0 40 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="30" rx="6" fill="#A1A1AA" />
      <rect
        width="40"
        height="30"
        rx="6"
        fill="url(#paint0_linear_28831_48895)"
        fillOpacity="0.2"
      />
      <rect
        x="0.25"
        y="0.25"
        width="39.5"
        height="29.5"
        rx="5.75"
        stroke="#18181B"
        strokeOpacity="0.1"
        strokeWidth="0.5"
      />
      <rect
        x="5"
        y="21.5"
        width="8"
        height="2"
        rx="1"
        fill="#18181B"
        fillOpacity="0.24"
      />
      <rect
        x="15"
        y="21.5"
        width="5"
        height="2"
        rx="1"
        fill="#18181B"
        fillOpacity="0.24"
      />
      <rect
        x="5"
        y="10"
        width="6"
        height="4"
        rx="1"
        fill="#18181B"
        fillOpacity="0.24"
      />
      <rect
        x="5.25"
        y="10.25"
        width="5.5"
        height="3.5"
        rx="0.75"
        stroke="#18181B"
        strokeOpacity="0.1"
        strokeWidth="0.5"
      />
      <g clipPath="url(#clip0_28831_48895)">
        <path
          d="M34.0612 20.9805L33.0423 20.3942C32.7089 20.2019 32.3003 20.2019 31.9669 20.3942L30.9433 20.9805C30.6146 21.1727 30.408 21.5292 30.408 21.9091V23.0862C30.408 23.4708 30.6146 23.8226 30.9433 24.0149L31.9622 24.6058C32.2956 24.7981 32.7042 24.7981 33.0376 24.6058L34.0565 24.0149C34.3899 23.8226 34.5919 23.4708 34.5919 23.0862V21.9091C34.6013 21.5292 34.3946 21.1727 34.0612 20.9805ZM32.5023 23.5459C31.9247 23.5459 31.4551 23.0769 31.4551 22.5C31.4551 21.9231 31.9247 21.4541 32.5023 21.4541C33.0798 21.4541 33.5541 21.9231 33.5541 22.5C33.5541 23.0769 33.0845 23.5459 32.5023 23.5459Z"
          fill="#18181B"
          fillOpacity="0.24"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_28831_48895"
          x1="20"
          y1="0"
          x2="20"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_28831_48895">
          <rect
            width="5"
            height="5"
            fill="white"
            transform="translate(30 20)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CreditCardIcon;
