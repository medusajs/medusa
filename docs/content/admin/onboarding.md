---
title: 'Example: How to Create Onboarding Widget'
description: 'Learn how to build the onboarding widget available in the admin dashboard the first time you install a Medusa project.'
addHowToData: true
badge:
  variant: orange
  text: beta
---

In this guide, you’ll learn how to build the onboarding widget available in the admin dashboard the first time you install a Medusa project.

:::note

The onboarding widget is already implemented within the codebase of your Medusa backend. This guide is helpful if you want to understand how it was implemented or you want an example of customizing the Medusa admin and backend.

:::

## What you’ll be Building

By following this tutorial, you’ll:

- Build an onboarding flow in the admin that takes the user through creating a sample product and order. This flow has four steps and navigates the user between four pages in the admin before completing the guide. This will be implemented using [Admin Widgets](./widgets.md).
- Keep track of the current step the user has reached by creating a table in the database and an API endpoint that the admin widget uses to retrieve and update the current step. These customizations will be applied to the backend.

![Onboarding Widget Demo](https://res.cloudinary.com/dza7lstvk/image/upload/v1686839259/Medusa%20Docs/Screenshots/onboarding-gif_nalqps.gif)

---

## Prerequisites

Before you follow along this tutorial, you must have a Medusa backend installed with the `beta` version of the `@medusajs/admin` package. If not, you can use the following command to get started:

```bash
npx create-medusa-app@latest
```

Please refer to the [create-medusa-app documentation](../create-medusa-app) for more details on this command, including prerequisites and troubleshooting.

---

## Preparation Steps

The steps in this section are used to prepare for the custom functionalities you’ll be creating in this tutorial.

### (Optional) TypeScript Configurations and package.json

If you're using TypeScript in your project, it's highly recommended to setup your TypeScript configurations and package.json as mentioned in [this guide](./widgets.md#optional-typescript-preparations).

### Install Medusa React

[Medusa React](../medusa-react/overview) is a React library that facilitates using Medusa’s endpoints within your React application. It also provides the utility to register and use custom endpoints.

To install Medusa React and its required dependencies, run the following command in the root directory of the Medusa backend:

```bash npm2yarn
npm install medusa-react @tanstack/react-query
```

### Implement Helper Resources

The resources in this section are used for typing, layout, and design purposes, and they’re used in other essential components in this tutorial.

Each of the collapsible elements below hold the path to the file that you should create, and the content of that file. 

<details>
  <summary>
  src/admin/types/icon-type.ts
  </summary>

  ```tsx title=src/admin/types/icon-type.ts
  import React from "react"
  
  type IconProps = {
    color?: string
    size?: string | number
  } & React.SVGAttributes<SVGElement>
  
  export default IconProps
  ```

</details>

<details>
  <summary>
  src/admin/components/shared/icons/check-circle-fill-icon.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/icons/check-circle-fill-icon.tsx
  import React from "react"
  import IconProps from "../../../types/icon-type"
  
  const CheckCircleFillIcon: React.FC<IconProps> = ({
    size = "24",
    color = "currentColor",
    ...attributes
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 10C18 14.4184 14.4184 18 10 18C5.5816 18 2 14.4184 2 10C2 5.5816 5.5816 2 10 2C14.4184 2 18 5.5816 18 10ZM13.9053 8.28033C14.1982 7.98744 14.1982 7.51256 13.9053 7.21967C13.6124 6.92678 13.1376 6.92678 12.8447 7.21967L8.875 11.1893L7.15533 9.46967C6.86244 9.17678 6.38756 9.17678 6.09467 9.46967C5.80178 9.76256 5.80178 10.2374 6.09467 10.5303L8.34467 12.7803C8.63756 13.0732 9.11244 13.0732 9.40533 12.7803L13.9053 8.28033Z"
          fill={color}
        />
      </svg>
    )
  }
  
  export default CheckCircleFillIcon
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/icons/cross-icon.tsx
  </summary>

  ```tsx title=src/admin/components/shared/icons/cross-icon.tsx
  import React from "react"
  import IconProps from "../../../types/icon-type"
  
  const CrossIcon: React.FC<IconProps> = ({
    size = "20",
    color = "currentColor",
    ...attributes
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      >
        <path
          d="M15 5L5 15"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 5L15 15"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  
  export default CrossIcon
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/icons/get-started-icon.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/icons/get-started-icon.tsx
  import React from "react"
  import IconProps from "../../../types/icon-type"
  
  const GetStartedIcon: React.FC<IconProps> = () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ddd_8923_1881)">
        <rect 
          x="4" 
          y="2" 
          width="40" 
          height="40" 
          rx="20" 
          fill="#F1F3F5"
        />
        <rect
          x="7.5"
          y="15.5"
          width="33"
          height="13"
          rx="2.5"
          fill="white"
        />
        <rect
          x="10"
          y="20.5"
          width="14"
          height="3"
          rx="1.5"
          fill="url(#paint0_linear_8923_1881)"
        />
        <rect
          x="7.5"
          y="15.5"
          width="33"
          height="13"
          rx="2.5"
          stroke="url(#paint1_linear_8923_1881)"
        />
        <rect
          x="9.5"
          y="2.5"
          width="29"
          height="10"
          rx="2.5"
          fill="url(#paint2_linear_8923_1881)"
        />
        <rect
          x="9.5"
          y="2.5"
          width="29"
          height="10"
          rx="2.5"
          stroke="url(#paint3_linear_8923_1881)"
        />
        <rect
          x="9.5"
          y="31.5"
          width="29"
          height="10"
          rx="2.5"
          fill="url(#paint4_linear_8923_1881)"
        />
        <rect
          x="9.5"
          y="31.5"
          width="29"
          height="10"
          rx="2.5"
          stroke="url(#paint5_linear_8923_1881)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.3251 22.9287C30.4646 22.9286 30.6 22.9752 30.7099 23.0609C30.8199 23.1467 30.898 23.2668 30.9318 23.402L31.1468 24.2654C31.3435 25.0487 31.9551 25.6604 32.7385 25.857L33.6018 26.072C33.7373 26.1056 33.8577 26.1836 33.9437 26.2935C34.0298 26.4035 34.0765 26.5391 34.0765 26.6787C34.0765 26.8183 34.0298 26.9539 33.9437 27.0639C33.8577 27.1738 33.7373 27.2518 33.6018 27.2854L32.7385 27.5004C31.9551 27.697 31.3435 28.3087 31.1468 29.092L30.9318 29.9554C30.8982 30.0909 30.8203 30.2113 30.7103 30.2973C30.6003 30.3834 30.4647 30.4301 30.3251 30.4301C30.1855 30.4301 30.0499 30.3834 29.94 30.2973C29.83 30.2113 29.752 30.0909 29.7185 29.9554L29.5035 29.092C29.4073 28.7074 29.2084 28.3561 28.9281 28.0758C28.6477 27.7954 28.2964 27.5965 27.9118 27.5004L27.0485 27.2854C26.9129 27.2518 26.7926 27.1738 26.7065 27.0639C26.6205 26.9539 26.5737 26.8183 26.5737 26.6787C26.5737 26.5391 26.6205 26.4035 26.7065 26.2935C26.7926 26.1836 26.9129 26.1056 27.0485 26.072L27.9118 25.857C28.2964 25.7609 28.6477 25.562 28.9281 25.2816C29.2084 25.0013 29.4073 24.65 29.5035 24.2654L29.7185 23.402C29.7523 23.2668 29.8304 23.1467 29.9403 23.0609C30.0502 22.9752 30.1857 22.9286 30.3251 22.9287Z"
          fill="url(#paint6_linear_8923_1881)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.7493 13.7515C36.858 13.7515 36.9637 13.7869 37.0504 13.8523C37.1371 13.9178 37.2002 14.0097 37.23 14.1141L37.772 16.0115C37.8887 16.4202 38.1077 16.7923 38.4082 17.0928C38.7087 17.3933 39.0808 17.6122 39.4894 17.7289L41.3868 18.271C41.4912 18.3009 41.5831 18.364 41.6484 18.4507C41.7138 18.5374 41.7492 18.643 41.7492 18.7516C41.7492 18.8602 41.7138 18.9659 41.6484 19.0526C41.5831 19.1393 41.4912 19.2024 41.3868 19.2323L39.4894 19.7743C39.0808 19.8911 38.7087 20.11 38.4082 20.4105C38.1077 20.711 37.8887 21.0831 37.772 21.4917L37.23 23.3891C37.2001 23.4935 37.137 23.5854 37.0503 23.6507C36.9636 23.7161 36.8579 23.7515 36.7493 23.7515C36.6407 23.7515 36.5351 23.7161 36.4484 23.6507C36.3616 23.5854 36.2986 23.4935 36.2686 23.3891L35.7266 21.4917C35.6099 21.0831 35.391 20.711 35.0905 20.4105C34.79 20.11 34.4179 19.8911 34.0092 19.7743L32.1118 19.2323C32.0074 19.2024 31.9156 19.1393 31.8502 19.0526C31.7849 18.9659 31.7495 18.8602 31.7495 18.7516C31.7495 18.643 31.7849 18.5374 31.8502 18.4507C31.9156 18.364 32.0074 18.3009 32.1118 18.271L34.0092 17.7289C34.4179 17.6122 34.79 17.3933 35.0905 17.0928C35.391 16.7923 35.6099 16.4202 35.7266 16.0115L36.2686 14.1141C36.2985 14.0097 36.3615 13.9178 36.4483 13.8523C36.535 13.7869 36.6407 13.7515 36.7493 13.7515Z"
          fill="url(#paint7_linear_8923_1881)"
        />
      </g>
      <defs>
        <filter
          id="filter0_ddd_8923_1881"
          x="0"
          y="0"
          width="48"
          height="48"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0666667 0 0 0 0 0.0941176 0 0 0 0 0.109804 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_8923_1881"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect2_dropShadow_8923_1881"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0666667 0 0 0 0 0.0941176 0 0 0 0 0.109804 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_8923_1881"
            result="effect2_dropShadow_8923_1881"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="dilate"
            in="SourceAlpha"
            result="effect3_dropShadow_8923_1881"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0666667 0 0 0 0 0.0941176 0 0 0 0 0.109804 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_8923_1881"
            result="effect3_dropShadow_8923_1881"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect3_dropShadow_8923_1881"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_8923_1881"
          x1="24"
          y1="20.5"
          x2="10"
          y2="23.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5EB0EF" />
          <stop offset="0.331911" stopColor="#0081F1" />
          <stop offset="0.664618" stopColor="#0081F1" />
          <stop offset="1" stopColor="#5EB0EF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_8923_1881"
          x1="24"
          y1="15"
          x2="24"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.700898" stopColor="#11181C" stopOpacity="0.1" />
          <stop offset="1" stopColor="#11181C" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_8923_1881"
          x1="24"
          y1="2"
          x2="24"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F1F3F5" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_8923_1881"
          x1="24"
          y1="9.89185"
          x2="24"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F1F3F5" />
          <stop offset="1" stopColor="#DFE3E6" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_8923_1881"
          x1="24"
          y1="31"
          x2="24"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F1F3F5" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_8923_1881"
          x1="24"
          y1="31"
          x2="24"
          y2="33.7617"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFE3E6" />
          <stop offset="1" stopColor="#F1F3F5" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_8923_1881"
          x1="34.0765"
          y1="22.9287"
          x2="26.2457"
          y2="23.2884"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5EB0EF" />
          <stop offset="0.331911" stopColor="#0081F1" />
          <stop offset="0.664618" stopColor="#0081F1" />
          <stop offset="1" stopColor="#5EB0EF" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_8923_1881"
          x1="41.7492"
          y1="13.7515"
          x2="31.3123"
          y2="14.2307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5EB0EF" />
          <stop offset="0.331911" stopColor="#0081F1" />
          <stop offset="0.664618" stopColor="#0081F1" />
          <stop offset="1" stopColor="#5EB0EF" />
        </linearGradient>
      </defs>
    </svg>
  )
  
  export default GetStartedIcon
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/icons/clipboard-copy-icon.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/icons/clipboard-copy-icon.tsx
  import React from "react"
  import IconProps from "../../../types/icon-type"
  
  const ClipboardCopyIcon: React.FC<IconProps> = ({
    size = "20",
    color = "currentColor",
    ...attributes
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      >
        <path
          d="M12.917 4.16669H14.3753C14.7621 4.16669 15.133 4.32277 15.4065 4.6006C15.68 4.87843 15.8337 5.25526 15.8337 5.64817V8.33335M7.08366 4.16669H5.62533C5.23855 4.16669 4.86762 4.32277 4.59413 4.6006C4.32064 4.87843 4.16699 5.25526 4.16699 5.64817V16.0185C4.16699 16.4115 4.32064 16.7883 4.59413 17.0661C4.86762 17.3439 5.23855 17.5 5.62533 17.5H14.3753C14.7621 17.5 15.133 17.3439 15.4065 17.0661C15.68 16.7883 15.8337 16.4115 15.8337 16.0185V15"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.875 2.5H8.125C7.77982 2.5 7.5 2.8731 7.5 3.33333V5C7.5 5.46024 7.77982 5.83333 8.125 5.83333H11.875C12.2202 5.83333 12.5 5.46024 12.5 5V3.33333C12.5 2.8731 12.2202 2.5 11.875 2.5Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 11.6667H10"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 9.16669L10 11.6667L12.5 14.1667"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  
  export default ClipboardCopyIcon
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/icons/computer-desktop-icon.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/icons/computer-desktop-icon.tsx
  import React from "react"
  import IconProps from "../../../types/icon-type"
  
  const ComputerDesktopIcon: React.FC<IconProps> = ({
    size = "24",
    color = "currentColor",
    ...attributes
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 2.25C0.5 1.65326 0.737053 1.08097 1.15901 0.65901C1.58097 0.237053 2.15326 0 2.75 0H14.25C14.8467 0 15.419 0.237053 15.841 0.65901C16.2629 1.08097 16.5 1.65326 16.5 2.25V10.75C16.5 11.3467 16.2629 11.919 15.841 12.341C15.419 12.7629 14.8467 13 14.25 13H11.145C11.3403 13.6543 11.7226 14.2372 12.245 14.677C12.3625 14.7762 12.4467 14.9092 12.4861 15.0579C12.5255 15.2065 12.5182 15.3637 12.4653 15.5081C12.4123 15.6526 12.3163 15.7772 12.1901 15.8652C12.064 15.9532 11.9138 16.0002 11.76 16H5.24C5.08628 16 4.93627 15.9528 4.81027 15.8647C4.68427 15.7767 4.58838 15.652 4.53557 15.5077C4.48275 15.3633 4.47557 15.2062 4.515 15.0576C4.55443 14.9091 4.63856 14.7762 4.756 14.677C5.27799 14.2371 5.65999 13.6542 5.855 13H2.75C2.15326 13 1.58097 12.7629 1.15901 12.341C0.737053 11.919 0.5 11.3467 0.5 10.75V2.25ZM2 2.25C2 2.05109 2.07902 1.86032 2.21967 1.71967C2.36032 1.57902 2.55109 1.5 2.75 1.5H14.25C14.4489 1.5 14.6397 1.57902 14.7803 1.71967C14.921 1.86032 15 2.05109 15 2.25V9.75C15 9.94891 14.921 10.1397 14.7803 10.2803C14.6397 10.421 14.4489 10.5 14.25 10.5H2.75C2.55109 10.5 2.36032 10.421 2.21967 10.2803C2.07902 10.1397 2 9.94891 2 9.75V2.25Z"
          fill={color}
        />
      </svg>
    )
  }
  
  export default ComputerDesktopIcon
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/icons/dollar-sign-icon.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/icons/dollar-sign-icon.tsx
  import React from "react"
  import IconProps from "../../../types/icon-type"
  
  const DollarSignIcon: React.FC<IconProps> = ({
    size = "24",
    color = "currentColor",
    ...attributes
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      >
        <path
          d="M12 3V21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 6H9.5C8.57174 6 7.6815 6.31607 7.02513 6.87868C6.36875 7.44129 6 8.20435 6 9C6 9.79565 6.36875 10.5587 7.02513 11.1213C7.6815 11.6839 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3161 16.9749 12.8787C17.6313 13.4413 18 14.2044 18 15C18 15.7956 17.6313 16.5587 16.9749 17.1213C16.3185 17.6839 15.4283 18 14.5 18H6"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  
  export default DollarSignIcon
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/accordion.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/accordion.tsx
  import * as AccordionPrimitive from "@radix-ui/react-accordion"
  import clsx from "clsx"
  import React from "react"
  import CheckCircleFillIcon from "./icons/check-circle-fill-icon"
  
  type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
    title: string;
    subtitle?: string;
    description?: string;
    required?: boolean;
    tooltip?: string;
    forceMountContent?: true;
    headingSize?: "small" | "medium" | "large";
    customTrigger?: React.ReactNode;
    complete?: boolean;
    active?: boolean;
    triggerable?: boolean;
  };
  
  const Accordion: React.FC<
    | (AccordionPrimitive.AccordionSingleProps &
        React.RefAttributes<HTMLDivElement>)
    | (AccordionPrimitive.AccordionMultipleProps &
        React.RefAttributes<HTMLDivElement>)
  > & {
    Item: React.FC<AccordionItemProps>;
  } = ({ children, ...props }) => {
    return (
      <AccordionPrimitive.Root {...props}>
        {children}
      </AccordionPrimitive.Root>
    )
  }
  
  const Item: React.FC<AccordionItemProps> = ({
    title,
    subtitle,
    description,
    required,
    tooltip,
    children,
    className,
    complete,
    headingSize = "large",
    customTrigger = undefined,
    forceMountContent = undefined,
    active,
    triggerable,
    ...props
  }) => {
    const headerClass = clsx({
      "inter-small-semibold": headingSize === "small",
      "inter-base-medium": headingSize === "medium",
      "inter-large-semibold": headingSize === "large",
    })
  
    const paddingClasses = clsx({
      "pb-0 mb-3 pt-3 ": headingSize === "medium",
      "pb-5 radix-state-open:pb-5xlarge mb-5 ": 
        headingSize === "large",
    })
  
    return (
      <AccordionPrimitive.Item
        {...props}
        className={clsx(
          "border-grey-20 group border-t last:mb-0",
          { "opacity-30": props.disabled },
          paddingClasses,
          className
        )}
      >
        <AccordionPrimitive.Header className="px-1">
          <div className="flex flex-col">
            <div className="flex w-full items-center justify-between">
              <div className="gap-x-2xsmall flex items-center">
                <div className="w-[25px] h-[25px] mr-4 flex items-center justify-center">
                  {complete ? (
                    <CheckCircleFillIcon color={"rgb(37, 99, 235)"} size="25px" />
                  ) : (
                    <span
                      className={clsx(
                        "rounded-full block border-gray-500 w-[20px] h-[20px] ml-[2px] border-2 transition-all",
                        {
                          "border-dashed border-blue-500 outline-4 outline-blue-200 outline outline-offset-2":
                            active,
                        }
                      )}
                    />
                  )}
                </div>
                <span className={headerClass}>
                  {title}
                  {required && <span className="text-rose-50">*</span>}
                </span>
              </div>
              <AccordionPrimitive.Trigger>
                {customTrigger || <MorphingTrigger />}
              </AccordionPrimitive.Trigger>
            </div>
            {subtitle && (
              <span className="inter-small-regular text-grey-50 mt-1">
                {subtitle}
              </span>
            )}
          </div>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content
          forceMount={forceMountContent}
          className={clsx(
            "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none px-1"
          )}
        >
          <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
            {description && <p className="text-grey-50 ">{description}</p>}
            <div className="w-full">{children}</div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
  
  Accordion.Item = Item
  
  const MorphingTrigger = () => {
    return (
      <div className="btn-ghost rounded-rounded group relative p-[6px]">
        <div className="h-5 w-5">
          <span className="bg-grey-50 rounded-circle group-radix-state-open:rotate-90 absolute inset-y-[31.75%] left-[48%] right-1/2 w-[1.5px] duration-300" />
          <span className="bg-grey-50 rounded-circle group-radix-state-open:rotate-90 group-radix-state-open:left-1/2 group-radix-state-open:right-1/2 absolute inset-x-[31.75%] top-[48%] bottom-1/2 h-[1.5px] duration-300" />
        </div>
      </div>
    )
  }
  
  export default Accordion
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/spinner.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/spinner.tsx
  import clsx from "clsx"
  import React from "react"
  
  type SpinnerProps = {
    size?: "large" | "medium" | "small";
    variant?: "primary" | "secondary";
  };
  
  const Spinner: React.FC<SpinnerProps> = ({
    size = "large",
    variant = "primary",
  }) => {
    return (
      <div
        className={clsx(
          "flex items-center justify-center",
          { "h-[24px] w-[24px]": size === "large" },
          { "h-[20px] w-[20px]": size === "medium" },
          { "h-[16px] w-[16px]": size === "small" }
        )}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <div
            className={clsx(
              "animate-ring rounded-circle h-4/5 w-4/5 border-2 border-transparent",
              { "border-t-grey-0": variant === "primary" },
              { "border-t-violet-60": variant === "secondary" }
            )}
          />
        </div>
      </div>
    )
  }
  
  export default Spinner
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/button.tsx
  </summary>

<!-- eslint-disable max-len -->
<!-- eslint-disable react/display-name -->

  ```tsx title=src/admin/components/shared/button.tsx
  import clsx from "clsx"
  import React, { Children } from "react"
  import Spinner from "./spinner"
  
  export type ButtonProps = {
    variant: "primary" | "secondary" | "ghost" | "danger" | "nuclear";
    size?: "small" | "medium" | "large";
    loading?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>;
  
  const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = "primary",
        size = "large",
        loading = false,
        children,
        ...attributes
      },
      ref
    ) => {
      const handleClick = (e) => {
        if (!loading && attributes.onClick) {
          attributes.onClick(e)
        }
      }
  
      const variantClassname = clsx({
        ["btn-primary"]: variant === "primary",
        ["btn-secondary"]: variant === "secondary",
        ["btn-ghost"]: variant === "ghost",
        ["btn-danger"]: variant === "danger",
        ["btn-nuclear"]: variant === "nuclear",
      })
  
      const sizeClassname = clsx({
        ["btn-large"]: size === "large",
        ["btn-medium"]: size === "medium",
        ["btn-small"]: size === "small",
      })
  
      return (
        <button
          {...attributes}
          className={clsx(
            "btn",
            variantClassname,
            sizeClassname,
            attributes.className
          )}
          disabled={attributes.disabled || loading}
          ref={ref}
          onClick={handleClick}
        >
          {loading ? (
            <Spinner size={size} variant={"secondary"} />
          ) : (
            Children.map(children, (child, i) => {
              return (
                <span key={i} className="mr-xsmall last:mr-0">
                  {child}
                </span>
              )
            })
          )}
        </button>
      )
    }
  )
  
  export default Button
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/code-snippets.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/code-snippets.tsx
  import React, { useState } from "react"
  import clsx from "clsx"
  import copy from "copy-to-clipboard"
  import { Highlight, themes } from "prism-react-renderer"
  import ClipboardCopyIcon from "./icons/clipboard-copy-icon"
  import CheckCircleFillIcon from "./icons/check-circle-fill-icon"
  
  const CodeSnippets = ({
    snippets,
  }: {
    snippets: {
      label: string;
      language: string;
      code: string;
    }[];
  }) => {
    const [active, setActive] = useState(snippets[0])
    const [copied, setCopied] = useState(false)
  
    const copyToClipboard = () => {
      setCopied(true)
      copy(active.code)
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  
    return (
      <div className="rounded-lg bg-stone-900">
        <div className="flex gap-2 rounded-t-lg border-b border-b-stone-600 bg-stone-800 px-6 py-4">
          {snippets.map((snippet) => (
            <div
              className={clsx(
                "text-small rounded-xl border border-transparent px-4 py-2 font-semibold",
                {
                  "border-stone-600 bg-stone-900 text-white":
                    active.label === snippet.label,
                },
                {
                  "cursor-pointer text-gray-400": active.label !== snippet.label,
                }
              )}
              key={snippet.label}
              onClick={() => setActive(snippet)}
            >
              {snippet.label}
            </div>
          ))}
        </div>
        <div className="p-6 relative">
          <div
            className="absolute right-4 top-4 text-gray-600 hover:text-gray-400 cursor-pointer"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckCircleFillIcon size="24px" />
            ) : (
              <ClipboardCopyIcon size="24px" />
            )}
          </div>
          <Highlight
            theme={{
              ...themes.palenight,
              plain: {
                color: "#7E7D86",
                backgroundColor: "#1C1C1F",
              },
            }}
            code={active.code}
            language={active.language}
          >
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                style={{ ...style, background: "transparent", fontSize: "12px" }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    )
  }
  
  export default CodeSnippets
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/container.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/container.tsx
  import React, { PropsWithChildren } from "react"
  
  type Props = PropsWithChildren<{
    title?: string;
    description?: string;
  }>;
  
  export const Container = ({ title, description, children }: Props) => {
    return (
      <div className="border border-grey-20 rounded-rounded bg-white py-6 px-8 flex flex-col mb-base relative">
        <div>
          <div className="flex items-center justify-between">
            {title && (
              <h2 className="text-[24px] leading-9 font-semibold">{title}</h2>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    )
  }
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/badge.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/badge.tsx
  import clsx from "clsx"
  import React from "react"
  
  type BadgeProps = {
    variant:
      | "primary"
      | "danger"
      | "success"
      | "warning"
      | "ghost"
      | "default"
      | "disabled"
      | "new-feature"
  } & React.HTMLAttributes<HTMLDivElement>
  
  const Badge: React.FC<BadgeProps> = ({
    children,
    variant,
    onClick,
    className,
    ...props
  }) => {
    const variantClassname = clsx({
      ["badge-primary"]: variant === "primary",
      ["badge-danger"]: variant === "danger",
      ["badge-success"]: variant === "success",
      ["badge-warning"]: variant === "warning",
      ["badge-ghost"]: variant === "ghost",
      ["badge-default"]: variant === "default",
      ["badge-disabled"]: variant === "disabled",
      ["bg-blue-10 border-blue-30 border font-normal text-blue-50"]:
        variant === "new-feature",
    })
  
    return (
      <div
        className={clsx("badge", variantClassname, className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  }
  
  export default Badge
  ```

</details>

<details>
  <summary>  
  src/admin/components/shared/icon-badge.tsx
  </summary>

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/shared/icon-badge.tsx
  import clsx from "clsx"
  import React from "react"
  import Badge from "./badge"
  
  type IconBadgeProps = {
    variant?:
      | "primary"
      | "danger"
      | "success"
      | "warning"
      | "ghost"
      | "default"
      | "disabled";
  } & React.HTMLAttributes<HTMLDivElement>;
  
  const IconBadge: React.FC<IconBadgeProps> = ({
    children,
    variant,
    className,
    ...rest
  }) => {
    return (
      <Badge
        variant={variant ?? "default"}
        className={clsx(
          "outline-grey-20 flex aspect-square h-[40px] w-[40px] items-center justify-center border-2 border-white outline outline-1",
          className
        )}
        {...rest}
      >
        {children}
      </Badge>
    )
  }
  
  export default IconBadge
  ```

</details>

---

## Step 1: Customize Medusa Backend

:::note

If you’re not interested in learning about backend customizations, you can skip to [step 2](#step-2-create-onboarding-widget).

:::

In this step, you’ll customize the Medusa backend to:

1. Add a new table in the database that stores the current onboarding step. This requires creating a new entity, repository, and migration.
2. Add a new endpoint that allows to retrieve and update the current onboarding step. This requires creating a new service and endpoint.

### Create Entity

An [entity](../development/entities/overview.mdx) represents a table in the database. It’s based on Typeorm, so it requires creating a repository and a migration to be used in the backend.

To create the entity, create the file `src/models/onboarding.ts` with the following content:

```ts title=src/models/onboarding.ts
import { BaseEntity } from "@medusajs/medusa"
import { Column, Entity } from "typeorm"

@Entity()
export class OnboardingState extends BaseEntity {
  @Column()
  current_step: string

  @Column()
  is_complete: boolean

  @Column()
  product_id: string
}
```

Then, create the file `src/repositories/onboarding.ts` that holds the repository of the entity with the following content:

```ts title=src/repositories/onboarding.ts
import {
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { OnboardingState } from "../models/onboarding"

const OnboardingRepository = dataSource.getRepository(
  OnboardingState
)

export default OnboardingRepository
```

You can learn more about entities and repositories in [this documentation](../development/entities/overview.mdx).

### Create Migration

A [migration](../development/entities/migrations/overview.mdx) is used to reflect database changes in your database schema.

To create a migration, run the following command in the root of your Medusa backend:

```bash
npx typeorm migration:create src/migrations/CreateOnboarding
```

This will create a file in the `src/migrations` directory with the name formatted as `<TIMESTAMP>-CreateOnboarding.ts`.

In that file, import the `generateEntityId` utility method at the top of the file:

```ts
import { generateEntityId } from "@medusajs/utils"
```

Then, replace the `up` and `down` methods in the migration class with the following content:

<!-- eslint-disable max-len -->

```ts
export class CreateOnboarding1685715079776 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "onboarding_state" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "current_step" character varying NULL, "is_complete" boolean, "product_id" character varying NULL)`
    )

    await queryRunner.query(
      `INSERT INTO "onboarding_state" ("id", "current_step", "is_complete") VALUES ('${generateEntityId(
        "",
        "onboarding"
      )}' , NULL, false)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "onboarding_state"`)
  }
}
```

:::warning

Don’t copy the name of the class in the code snippet above. Keep the name you have in the file.

:::

Finally, to reflect the migration in the database, run the `build` and `migration` commands:

```bash npm2yarn
npm run build
npx medusa migrations run
```

You can learn more about migrations in [this guide](../development/entities/migrations/overview.mdx).

### Create Service

A [service](../development/services/overview.mdx) is a class that holds helper methods related to an entity. For example, methods to create or retrieve a record of that entity. Services are used by other resources, such as endpoints, to perform functionalities related to an entity.

So, before you add the endpoints that allow retrieving and updating the onboarding state, you need to add the service that implements these helper functionalities.

Start by creating the file `src/types/onboarding.ts` with the following content:

<!-- eslint-disable @typescript-eslint/no-empty-interface -->

```ts title=src/types/onboarding.ts
import { OnboardingState } from "../models/onboarding"

export type UpdateOnboardingStateInput = {
  current_step?: string;
  is_complete?: boolean;
  product_id?: string;
};

export interface AdminOnboardingUpdateStateReq {}

export type OnboardingStateRes = {
  status: OnboardingState;
};
```

This file holds the necessary types that will be used within the service you’ll create, and later in your onboarding flow widget.

Then, create the file `src/services/onboarding.ts` with the following content:

<!-- eslint-disable prefer-rest-params -->

```ts title=src/services/onboarding.ts
import { TransactionBaseService } from "@medusajs/medusa"
import OnboardingRepository from "../repositories/onboarding"
import { OnboardingState } from "../models/onboarding"
import { EntityManager, IsNull, Not } from "typeorm"
import { UpdateOnboardingStateInput } from "../types/onboarding"

type InjectedDependencies = {
  manager: EntityManager;
  onboardingRepository: typeof OnboardingRepository;
};

class OnboardingService extends TransactionBaseService {
  protected onboardingRepository_: typeof OnboardingRepository

  constructor({ onboardingRepository }: InjectedDependencies) {
    super(arguments[0])

    this.onboardingRepository_ = onboardingRepository
  }

  async retrieve(): Promise<OnboardingState | undefined> {
    const onboardingRepo = this.activeManager_.withRepository(
      this.onboardingRepository_
    )

    const status = await onboardingRepo.findOne({
      where: { id: Not(IsNull()) },
    })

    return status
  }

  async update(
    data: UpdateOnboardingStateInput
  ): Promise<OnboardingState> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const onboardingRepository = 
          transactionManager.withRepository(
            this.onboardingRepository_
          )

        const status = await this.retrieve()

        for (const [key, value] of Object.entries(data)) {
          status[key] = value
        }

        return await onboardingRepository.save(status)
      }
    )
  }
}

export default OnboardingService
```

This service class implements two methods `retrieve` to retrieve the current onboarding state, and `update` to update the current onboarding state.

You can learn more about services in [this documentation](../development/services/overview.mdx).

### Create Endpoint

The last part of this step is to create the [endpoints](../development/endpoints/overview) that you’ll consume in the admin widget. There will be two endpoints: Get Onboarding State and Update Onboarding State.

To add the Get Onboarding State endpoint, create the file `src/api/routes/admin/onboarding/get-status.ts` with the following content:

```ts title=src/api/routes/admin/onboarding/get-status.ts
import { Request, Response } from "express"
import OnboardingService from "../../../../services/onboarding"

export default async function getOnboardingStatus(
  req: Request, 
  res: Response
) {
  const onboardingService: OnboardingService =
    req.scope.resolve("onboardingService")

  const status = await onboardingService.retrieve()

  res.status(200).json({ status })
}
```

Notice how this endpoint uses the `OnboardingService`'s `retrieve` method to retrieve the current onboarding state. It resolves the `OnboardingService` using the [Dependency Container.](../development/fundamentals/dependency-injection.md)

To add the Update Onboarding State, create the file `src/api/routes/admin/onboarding/update-status.ts` with the following content:

```ts title=src/api/routes/admin/onboarding/update-status.ts
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import OnboardingService from "../../../../services/onboarding"

export default async function updateOnboardingStatus(
  req: Request,
  res: Response
) {
  const onboardingService: OnboardingService =
    req.scope.resolve("onboardingService")
  const manager: EntityManager = req.scope.resolve("manager")

  const status = await manager.transaction(
    async (transactionManager) => {
      return await onboardingService
        .withTransaction(transactionManager)
        .update(req.body)
    })

  res.status(200).json({ status })
}
```

Notice how this endpoint uses the `OnboardingService`'s `update` method to update the current onboarding state.

After creating the endpoints, you need to register them in a router and export the router for the Medusa core to load.

To do that, start by creating the file `src/api/routes/admin/onboarding/index.ts` with the following content:

```ts title=src/api/routes/admin/onboarding/index.ts
import { wrapHandler } from "@medusajs/utils"
import { Router } from "express"
import getOnboardingStatus from "./get-status"
import updateOnboardingStatus from "./update-status"

const router = Router()

export default (adminRouter: Router) => {
  adminRouter.use("/onboarding", router)

  router.get("/", wrapHandler(getOnboardingStatus))
  router.post("/", wrapHandler(updateOnboardingStatus))
}
```

This file creates a router that registers the Get Onboarding State and Update Onboarding State endpoints.

Next, create or change the content of the file `src/api/routes/admin/index.ts` to the following:

```ts title=src/api/routes/admin/index.ts
import { Router } from "express"
import { wrapHandler } from "@medusajs/medusa"
import onboardingRoutes from "./onboarding"
import customRouteHandler from "./custom-route-handler"

// Initialize a custom router
const router = Router()

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/custom", router)

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(customRouteHandler))

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter)
}
```

This file exports the router created in `src/api/routes/admin/onboarding/index.ts`.

Finally, create or change the content of the file `src/api/index.ts` to the following content:

```ts title=src/api/index.ts
import { Router } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { authenticate, ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"
import { attachStoreRoutes } from "./routes/store"
import { attachAdminRoutes } from "./routes/admin"

export default (rootDirectory: string): Router | Router[] => {
  // Read currently-loaded medusa config
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  )
  const { projectConfig } = configModule

  // Set up our CORS options objects, based on config
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  }

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  }

  // Set up express router
  const router = Router()

  // Set up root routes for store and admin endpoints, 
  // with appropriate CORS settings
  router.use(
    "/store",
    cors(storeCorsOptions),
    bodyParser.json()
  )
  router.use(
    "/admin",
    cors(adminCorsOptions),
    bodyParser.json()
  )

  // Add authentication to all admin routes *except*
  // auth and account invite ones
  router.use(
    /\/admin\/((?!auth)(?!invites).*)/,
    authenticate()
  )

  // Set up routers for store and admin endpoints
  const storeRouter = Router()
  const adminRouter = Router()

  // Attach these routers to the root routes
  router.use("/store", storeRouter)
  router.use("/admin", adminRouter)

  // Attach custom routes to these routers
  attachStoreRoutes(storeRouter)
  attachAdminRoutes(adminRouter)

  return router
}
```

This is the file that the Medusa core loads the endpoints from. In this file, you export a router that registers store and admin endpoints, including the `onboarding` endpoints you just added.

You can learn more about endpoints in [this documentation](../development/endpoints/overview.mdx).

---

## Step 2: Create Onboarding Widget

In this step, you’ll create the onboarding widget with a general implementation. Some implementation details will be added later in the tutorial.

Create the file `src/admin/widgets/onboarding-flow/onboarding-flow.tsx` with the following content:

<!-- eslint-disable max-len -->
<!-- eslint-disable @typescript-eslint/ban-types -->

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
import React, {
  useState,
  useEffect,
} from "react"
import { 
  Container,
} from "../../components/shared/container"
import Button from "../../components/shared/button"
import {
  WidgetConfig,
} from "@medusajs/admin"
import Accordion from "../../components/shared/accordion"
import GetStartedIcon from "../../components/shared/icons/get-started-icon"
import { 
  OnboardingState,
} from "../../../models/onboarding"
import { 
  useNavigate,
} from "react-router-dom"
import {
  AdminOnboardingUpdateStateReq,
  OnboardingStateRes,
  UpdateOnboardingStateInput,
} from "../../../types/onboarding"

type STEP_ID =
  | "create_product"
  | "preview_product"
  | "create_order"
  | "setup_finished";

export type StepContentProps = any & {
  onNext?: Function;
  isComplete?: boolean;
  data?: OnboardingState;
} & any;

type Step = {
  id: STEP_ID;
  title: string;
  component: React.FC<StepContentProps>;
  onNext?: Function;
};

const STEP_FLOW: STEP_ID[] = [
  "create_product",
  "preview_product",
  "create_order",
  "setup_finished",
]

const OnboardingFlow = (props: any) => {
  const navigate = useNavigate()

  // TODO change based on state in backend
  const currentStep: STEP_ID | undefined = "create_product" as STEP_ID

  const [openStep, setOpenStep] = useState(currentStep)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    setOpenStep(currentStep)
    if (currentStep === STEP_FLOW[STEP_FLOW.length - 1]) {setCompleted(true)}
  }, [currentStep])

  const updateServerState = (payload: any) => {
    // TODO update state in the backend
  }

  const onStart = () => {
    // TODO update state in the backend
    navigate(`/a/products`)
  }

  const setStepComplete = ({
    step_id,
    extraData,
    onComplete,
  }: {
    step_id: STEP_ID;
    extraData?: UpdateOnboardingStateInput;
    onComplete?: () => void;
  }) => {
    // TODO update state in the backend
  }

  const goToProductView = (product: any) => {
    setStepComplete({
      step_id: "create_product",
      extraData: { product_id: product.id },
      onComplete: () => navigate(`/a/products/${product.id}`),
    })
  }

  const goToOrders = () => {
    setStepComplete({
      step_id: "preview_product",
      onComplete: () => navigate(`/a/orders`),
    })
  }

  const goToOrderView = (order: any) => {
    setStepComplete({
      step_id: "create_order",
      onComplete: () => navigate(`/a/orders/${order.id}`),
    })
  }

  const onComplete = () => {
    setCompleted(true)
  }

  const onHide = () => {
    updateServerState({ is_complete: true })
  }

  // TODO add steps
  const Steps: Step[] = []

  const isStepComplete = (step_id: STEP_ID) =>
    STEP_FLOW.indexOf(currentStep) > STEP_FLOW.indexOf(step_id)

    return (
      <>
        <Container>
          <Accordion
            type="single"
            className="my-3"
            value={openStep}
            onValueChange={(value) => setOpenStep(value as STEP_ID)}
          >
            <div className="flex items-center">
              <div className="mr-5">
                <GetStartedIcon />
              </div>
              {!completed ? (
                <>
                  <div>
                    <h1 className="font-semibold text-lg">Get started</h1>
                    <p>
                      Learn the basics of Medusa by creating your first order.
                    </p>
                  </div>
                  <div className="ml-auto flex items-start gap-2">
                    {currentStep ? (
                      <>
                        {currentStep === STEP_FLOW[STEP_FLOW.length - 1] ? (
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => onComplete()}
                          >
                            Complete Setup
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => onHide()}
                          >
                            Cancel Setup
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => onHide()}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => onStart()}
                        >
                          Begin setup
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h1 className="font-semibold text-lg">
                      Thank you for completing the setup guide!
                    </h1>
                    <p>
                      This whole experience was built using our new{" "}
                      <strong>widgets</strong> feature.
                      <br /> You can find out more details and build your own by
                      following{" "}
                      <a
                        href="https://docs.medusajs.com/"
                        target="_blank"
                        className="text-blue-500 font-semibold" rel="noreferrer"
                      >
                        our guide
                      </a>
                      .
                    </p>
                  </div>
                  <div className="ml-auto flex items-start gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onHide()}
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
            {
              <div className="mt-5">
                {(!completed ? Steps : Steps.slice(-1)).map((step, index) => {
                  const isComplete = isStepComplete(step.id)
                  const isCurrent = currentStep === step.id
                  return (
                    <Accordion.Item
                      title={step.title}
                      value={step.id}
                      headingSize="medium"
                      active={isCurrent}
                      complete={isComplete}
                      disabled={!isComplete && !isCurrent}
                      key={index}
                      {...(!isComplete &&
                        !isCurrent && {
                          customTrigger: <></>,
                        })}
                    >
                      <div className="py-3 px-11 text-gray-500">
                        <step.component
                          onNext={step.onNext}
                          isComplete={isComplete}
                          // TODO pass data
                          {...props}
                        />
                      </div>
                    </Accordion.Item>
                  )
                })}
              </div>
            }
          </Accordion>
        </Container>
      </>
    )
}

export const config: WidgetConfig = {
  zone: [
    "product.list.before",
    "product.details.before",
    "order.list.before",
    "order.details.before",
  ],
}

export default OnboardingFlow
```

There are three important details to ensure that Medusa reads this file as a widget:

1. The file is placed under the `src/admin/widget` directory.
2. The file exports a `config` object of type `WidgetConfig`, which is imported from `@medusajs/admin`.
3. The file default exports a React component, which in this case is `OnboardingFlow`

The extension uses `react-router-dom`, which is available as a dependency of the `@medusajs/admin` package, to navigate to other pages in the dashboard.

The `OnboardingFlow` widget also implements functionalities related to handling the steps of the onboarding flow, including navigating between them and updating the current step in the backend. Some parts are left as `TODO` until you add the components for each step, and you implement customizations in the backend.

You can learn more about Admin Widgets in [this documentation](./widgets.md).

---

## Step 3: Create Step Components

In this section, you’ll create the components for each step in the onboarding flow. You’ll then update the `OnboardingFlow` widget to use these components.

<details>
  <summary>  
  ProductsList component
  
  </summary>

  The `ProductsList` component is used in the first step of the onboarding widget. It allows the user to either open the Create Product modal or create a sample product.

  Create the file `src/admin/components/onboarding-flow/products/products-list.tsx` with the following content:

<!-- eslint-disable max-len -->

  ```tsx title=src/admin/components/onboarding-flow/products/products-list.tsx
  import React from "react"
  import Button from "../../shared/button"
  import { 
    useAdminCreateProduct,
    useAdminCreateCollection,
  } from "medusa-react"
  import { 
    useAdminRegions,
  } from "medusa-react"
  import { 
    StepContentProps,
  } from "../../../widgets/onboarding-flow/onboarding-flow"
  
  enum ProductStatus {
    PUBLISHED = "published",
  }

  const ProductsList = ({ onNext, isComplete }: StepContentProps) => {
    const { mutateAsync: createCollection, isLoading: collectionLoading } =
      useAdminCreateCollection()
    const { mutateAsync: createProduct, isLoading: productLoading } =
      useAdminCreateProduct()
    const { regions } = useAdminRegions()
  
    const isLoading = collectionLoading || productLoading
  
    const createSample = async () => {
      try {
        const { collection } = await createCollection({
          title: "Merch",
          handle: "merch",
        })
        const { product } = await createProduct({
          title: "Medusa T-Shirt",
          description: "Comfy t-shirt with Medusa logo",
          subtitle: "Black",
          is_giftcard: false,
          discountable: false,
          options: [{ title: "Size" }],
          images: [
            "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
          ],
          collection_id: collection.id,
          variants: [
            {
              title: "Small",
              inventory_quantity: 25,
              manage_inventory: true,
              prices: regions.map((region) => ({
                amount: 5000,
                currency_code: region.currency_code,
              })),
              options: [{ value: "S" }],
            },
            {
              title: "Medium",
              inventory_quantity: 10,
              manage_inventory: true,
              prices: regions.map((region) => ({
                amount: 5000,
                currency_code: region.currency_code,
              })),
              options: [{ value: "M" }],
            },
            {
              title: "Large",
              inventory_quantity: 17,
              manage_inventory: true,
              prices: regions.map((region) => ({
                amount: 5000,
                currency_code: region.currency_code,
              })),
              options: [{ value: "L" }],
            },
            {
              title: "Extra Large",
              inventory_quantity: 22,
              manage_inventory: true,
              prices: regions.map((region) => ({
                amount: 5000,
                currency_code: region.currency_code,
              })),
              options: [{ value: "XL" }],
            },
          ],
          status: ProductStatus.PUBLISHED,
        })
        onNext(product)
      } catch (e) {
        console.error(e)
      }
    }
  
    return (
      <div>
        <p>
          Create a product and set its general details such as title and
          description, its price, options, variants, images, and more. You&apos;ll then
          use the product to create a sample order.
        </p>
        <p>
          If you&apos;re not ready to create a product, we can create a sample product
          for you.
        </p>
        {!isComplete && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              size="small"
              onClick={() => createSample()}
              loading={isLoading}
            >
              Create sample product
            </Button>
          </div>
        )}
      </div>
    )
  }
  
  export default ProductsList
  ```

</details>

<details>
  <summary>  
  ProductDetail component
  
  </summary>

  The `ProductDetail` component is used in the second step of the onboarding. It shows the user a code snippet to preview the product they created in the first step.
  
  Create the file `src/admin/components/onboarding-flow/products/product-detail.tsx` with the following content:

<!-- eslint-disable max-len -->
  
  ```tsx title=src/admin/components/onboarding-flow/products/product-detail.tsx
  import React from "react"
  import { 
    useAdminPublishableApiKeys,
  } from "medusa-react"
  import Button from "../../shared/button"
  import CodeSnippets from "../../shared/code-snippets"
  import { 
    StepContentProps,
  } from "../../../widgets/onboarding-flow/onboarding-flow"
  
  const ProductDetail = ({ onNext, isComplete, data }: StepContentProps) => {
    const { 
      publishable_api_keys: keys, 
      isLoading, 
    } = useAdminPublishableApiKeys({
      offset: 0,
      limit: 1,
    })
    const api_key = keys?.[0]?.id || "pk_01H0PY648BTMEJR34ZDATXZTD9"
    return (
      <div>
        <p>On this page, you can view your product&apos;s details and edit them.</p>
        <p>
          You can preview your product using Medusa&apos;s Store APIs. You can copy any
          of the following code snippets to try it out.
        </p>
        <div className="pt-4">
          {!isLoading && (
            <CodeSnippets
              snippets={[
                {
                  label: "cURL",
                  language: "markdown",
                  code: `curl -H 'x-publishable-key: ${api_key}' 'http://localhost:9000/store/products/${data?.product_id}'`,
                },
                {
                  label: "Medusa JS Client",
                  language: "jsx",
                  code: `// Install the JS Client in your storefront project: @medusajs/medusa-js\n\nimport Medusa from "@medusajs/medusa-js"\n\nconst medusa = new Medusa({ publishableApiKey: "${api_key}"})\nconst product = await medusa.products.retrieve("${data?.product_id}")\nconsole.log(product.id)`,
                },
                {
                  label: "Medusa React",
                  language: "tsx",
                  code: `// Install the React SDK and required dependencies in your storefront project:\n// medusa-react @tanstack/react-query @medusajs/medusa\n\nimport { useProduct } from "medusa-react"\n\nconst { product } = useProduct("${data?.product_id}")\nconsole.log(product.id)`,
                },
              ]}
            />
          )}
        </div>
        <div className="flex mt-base gap-2">
          <a
            href={`http://localhost:9000/store/products/${data?.product_id}`}
            target="_blank" rel="noreferrer"
          >
            <Button variant="secondary" size="small">
              Open preview in browser
            </Button>
          </a>
          {!isComplete && (
            <Button variant="primary" size="small" onClick={() => onNext()}>
              Next step
            </Button>
          )}
        </div>
      </div>
    )
  }
  
  export default ProductDetail
  ```

</details>

<details>
  <summary>  
  OrdersList component
  
  </summary>

  The `OrdersList` component is used in the third step of the onboarding. It allows the user to create a sample order.
  
  Create the file `src/admin/components/onboarding-flow/orders/orders-list.tsx` with the following content:

<!-- eslint-disable max-len -->
  
  ```tsx title=src/admin/components/onboarding-flow/orders/orders-list.tsx
  import React from "react"
  import Button from "../../shared/button"
  import { 
    useAdminProduct,
  } from "medusa-react"
  import { 
    useAdminCreateDraftOrder,
  } from "medusa-react"
  import { 
    useAdminShippingOptions,
  } from "medusa-react"
  import { 
    useAdminRegions,
  } from "medusa-react"
  import { 
    useMedusa,
  } from "medusa-react"
  import { 
    StepContentProps,
  } from "../../../widgets/onboarding-flow/onboarding-flow"
  
  const OrdersList = ({ onNext, isComplete, data }: StepContentProps) => {
    const { product } = useAdminProduct(data.product_id)
    const { mutateAsync: createDraftOrder, isLoading } =
      useAdminCreateDraftOrder()
    const { client } = useMedusa()
  
    const { regions } = useAdminRegions()
    const { shipping_options } = useAdminShippingOptions()
  
    const createOrder = async () => {
      const variant = product.variants[0] ?? null
      try {
        const { draft_order } = await createDraftOrder({
          email: "customer@medusajs.com",
          items: [
            variant
              ? {
                  quantity: 1,
                  variant_id: variant.id,
                }
              : {
                  quantity: 1,
                  title: product.title,
                  unit_price: 50,
                },
          ],
          shipping_methods: [
            {
              option_id: shipping_options[0].id,
            },
          ],
          region_id: regions[0].id,
        })
  
        const { order } = await client.admin.draftOrders.markPaid(draft_order.id)
  
        onNext(order)
      } catch (e) {
        console.error(e)
      }
    }
    return (
      <>
        <div className="py-4">
          <p>
            With a Product created, we can now place an Order. Click the button
            below to create a sample order.
          </p>
        </div>
        <div className="flex gap-2">
          {!isComplete && (
            <Button
              variant="primary"
              size="small"
              onClick={() => createOrder()}
              loading={isLoading}
            >
              Create a sample order
            </Button>
          )}
        </div>
      </>
    )
  }
  
  export default OrdersList
  ```

</details>

<details>
  <summary>  
  OrderDetail component
  
  </summary>

  The `OrderDetail` component is used in the fourth and final step of the onboarding. It educates the user on the next steps when developing with Medusa.
  
  Create the file `src/admin/components/onboarding-flow/orders/order-detail.tsx` with the following content:

<!-- eslint-disable max-len -->
  
  ```tsx title=src/admin/components/onboarding-flow/orders/order-detail.tsx
  import React from "react"
  import IconBadge from "../../shared/icon-badge"
  import ComputerDesktopIcon from "../../shared/icons/computer-desktop-icon"
  import DollarSignIcon from "../../shared/icons/dollar-sign-icon"
  
  const OrderDetail = () => {
    return (
      <>
        <p className="text-sm">
          You finished the setup guide 🎉 You now have your first order. Feel free
          to play around with the order management functionalities, such as
          capturing payment, creating fulfillments, and more.
        </p>
        <h2 className="text-base mt-5 pt-5 pb-5 font-semibold text-black border-t border-gray-300 border-solid">
          Start developing with Medusa
        </h2>
        <p className="text-sm">
          Medusa is a completely customizable commerce solution. We&apos;ve curated
          some essential guides to kickstart your development with Medusa.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-5 pb-5 mb-5 border-b border-gray-300 border-solid">
          <a
            href="https://medusa-docs-git-docs-onboarding-material-medusajs.vercel.app/starters/nextjs-medusa-starter?path=simple-quickstart"
            target="_blank" rel="noreferrer"
          >
            <div
              className="p-4 rounded-rounded flex items-center bg-slate-50"
              style={{
                boxShadow:
                  "0px 0px 0px 1px rgba(17, 24, 28, 0.08), 0px 1px 2px -1px rgba(17, 24, 28, 0.08), 0px 2px 4px rgba(17, 24, 28, 0.04)",
              }}
            >
              <div className="mr-base">
                <IconBadge>
                  <DollarSignIcon />
                </IconBadge>
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  Start Selling in 3 Steps
                </p>
                <p className="text-xs">
                  Go live with a backend, an admin,
                  <br /> and a storefront in three steps.
                </p>
              </div>
            </div>
          </a>
          <a
            href="https://medusa-docs-git-docs-onboarding-material-medusajs.vercel.app/recipes"
            target="_blank" rel="noreferrer"
          >
            <div
              className="p-4 rounded-rounded items-center flex bg-slate-50"
              style={{
                boxShadow:
                  "0px 0px 0px 1px rgba(17, 24, 28, 0.08), 0px 1px 2px -1px rgba(17, 24, 28, 0.08), 0px 2px 4px rgba(17, 24, 28, 0.04)",
              }}
            >
              <div className="mr-base">
                <IconBadge>
                  <ComputerDesktopIcon />
                </IconBadge>
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  Build a Custom Commerce Application
                </p>
                <p className="text-xs">
                  Learn how to build a marketplace, subscription-based
                  <br /> purchases, or your custom use-case.
                </p>
              </div>
            </div>
          </a>
        </div>
        <div>
          You can find more useful guides in{" "}
          <a
            href="https://docs.medusajs.com/"
            target="_blank"
            className="text-blue-500 font-semibold" rel="noreferrer"
          >
            our documentation
          </a>
          .
        </div>
      </>
    )
  }
  
  export default OrderDetail
  ```
</details>

After creating the above components, import them at the top of `src/admin/widgets/onboarding-flow/onboarding-flow.tsx`:

<!-- eslint-disable max-len -->

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
import ProductsList from "../../components/onboarding-flow/products/products-list"
import ProductDetail from "../../components/onboarding-flow/products/product-detail"
import OrdersList from "../../components/onboarding-flow/orders/orders-list"
import OrderDetail from "../../components/onboarding-flow/orders/order-detail"
```

Then, replace the initialization of the `Steps` variable within the `OnboardingFlow` widget with the following:

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
// TODO add steps
const Steps: Step[] = [
  {
    id: "create_product",
    title: "Create Product",
    component: ProductsList,
    onNext: goToProductView,
  },
  {
    id: "preview_product",
    title: "Preview Product",
    component: ProductDetail,
    onNext: goToOrders,
  },
  {
    id: "create_order",
    title: "Create an Order",
    component: OrdersList,
    onNext: goToOrderView,
  },
  {
    id: "setup_finished",
    title: "Setup Finished: Start developing with Medusa",
    component: OrderDetail,
  },
]
```

The next step is to retrieve the current step of the onboarding flow from the Medusa backend.

---

## Step 4: Use Endpoints From Widget

In this section, you’ll implement the `TODO`s in the `OnboardingFlow` that require communicating with the backend.

There are different ways you can consume custom backend endpoints. The Medusa React library provides utility methods that allow you to create hooks similar to those available by default in the library. You can then utilize these hooks to send requests to custom backend endpoints.

Add the following imports at the top of `src/admin/widgets/onboarding-flow/onboarding-flow.tsx`:

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
import {
  useAdminCustomPost,
  useAdminCustomQuery,
} from "medusa-react"
```

Next, add the following at the top of the `OnboardingFlow` component:

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
const OnboardingFlow = (props: any) => {
  const QUERY_KEY = ["onboarding_state"]
  const { data, isLoading } = useAdminCustomQuery<
    undefined,
    OnboardingStateRes
  >("/onboarding", QUERY_KEY)
  const { mutate } = useAdminCustomPost<
    AdminOnboardingUpdateStateReq,
    OnboardingStateRes
  >("/onboarding", QUERY_KEY)

  // ...
}
```

Learn more about the available custom hooks such as `useAdminCustomPost` and `useAdminCustomQuery` in the [Medusa React documentation](../medusa-react/overview.mdx#custom-hooks).

`data` now holds the current onboarding state from the backend, and `mutate` can be used to update the onboarding state in the backend.

After that, replace the declarations within `OnboardingFlow` that had a `TODO` comment with the following:

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
const OnboardingFlow = (props: ExtensionProps) => {
  // ...
  const currentStep: STEP_ID | undefined = data?.status
    ?.current_step as STEP_ID

  if (
    !isLoading &&
    data?.status?.is_complete &&
    !localStorage.getItem("override_onboarding_finish")
  )
    {return null}

  const updateServerState = (
    payload: UpdateOnboardingStateInput,
    onSuccess: () => void = () => {}
  ) => {
    mutate(payload, { onSuccess })
  }

  const onStart = () => {
    updateServerState({ current_step: STEP_FLOW[0] })
    navigate(`/a/products`)
  }

  const setStepComplete = ({
    step_id,
    extraData,
    onComplete,
  }: {
    step_id: STEP_ID;
    extraData?: UpdateOnboardingStateInput;
    onComplete?: () => void;
  }) => {
    const next = STEP_FLOW[
      STEP_FLOW.findIndex((step) => step === step_id) + 1
    ]
    updateServerState({ 
      current_step: next, 
      ...extraData,
    }, onComplete)
  }

  // ...
}
```

`currentStep` now holds the current step retrieve from the backend; `updateServerState` updates the current step in the backend; `onStart` updates the current step in the backend to the first step; and `setStepComplete` completes the current step by updating the current step in the backend to the following step.

Finally, in the returned JSX, update the `TODO` in the `<step.component>` component to pass the component the necessary `data`:

```tsx title=src/admin/widgets/onboarding-flow/onboarding-flow.tsx
<step.component
  onNext={step.onNext}
  isComplete={isComplete}
  data={data?.status}
  {...props}
/>
```

---

## Step 5: Test it Out

You’ve now implemented everything necessary for the onboarding flow! You can test it out by building the changes and running the `develop` command:

```bash npm2yarn
npm run build
npx medusa develop
```

If you open the admin at `localhost:7001` and log in, you’ll see the onboarding widget in the Products listing page. You can try using it and see your implementation in action!

---

## Next Steps: Continue Development

- [Learn more about Admin Widgets](./widgets.md)
- [Learn how you can start custom development in your backend](../recipes/index.mdx)
