import { motion } from "framer-motion"

import { IconAvatar } from "../icon-avatar"

export default function AvatarBox({ checked }: { checked?: boolean }) {
  return (
    <IconAvatar
      size="xlarge"
      className="bg-ui-button-neutral shadow-buttons-neutral after:button-neutral-gradient relative mb-4 flex items-center justify-center rounded-xl after:inset-0 after:content-[''] w-[52px] h-[52px]"
    >
      {checked && (
        <motion.div
          className="absolute -right-[5px] -top-1 flex size-5 items-center justify-center rounded-full border-[0.5px] border-[rgba(3,7,18,0.2)] bg-[#3B82F6] bg-gradient-to-b from-white/0 to-white/20 shadow-[0px_1px_2px_0px_rgba(3,7,18,0.12),0px_1px_2px_0px_rgba(255,255,255,0.10)_inset,0px_-1px_5px_0px_rgba(255,255,255,0.10)_inset,0px_0px_0px_0px_rgba(3,7,18,0.06)_inset]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <motion.path
              d="M5.8335 10.4167L9.16683 13.75L14.1668 6.25"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.3,
                delay: 1.1,
                bounce: 0.6,
                ease: [0.1, 0.8, 0.2, 1.01],
              }}
            />
          </svg>
        </motion.div>
      )}
      <svg
        className="rounded-[10px]"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="400" fill="#18181B" />
        <path
          d="M238.088 51.1218L238.089 51.1223L310.605 92.8101C334.028 106.308 348.526 131.32 347.868 157.953L347.867 157.966V157.978V241.688C347.867 268.68 333.687 293.362 310.271 306.856L310.269 306.858L237.754 348.878C214.336 362.374 185.643 362.374 162.225 348.878L89.7127 306.859C66.6206 293.361 52.1113 268.674 52.1113 241.688V157.978C52.1113 131.326 66.6211 106.307 89.7088 92.8093C89.7101 92.8085 89.7114 92.8078 89.7127 92.807L162.556 51.1233L162.559 51.1218C185.977 37.6261 214.67 37.6261 238.088 51.1218ZM124.634 200C124.634 241.576 158.502 275.372 200.156 275.372C242.142 275.372 276.013 241.578 276.013 200C276.013 158.419 241.805 124.628 200.156 124.628C158.502 124.628 124.634 158.424 124.634 200Z"
          fill="url(#paint0_linear_11869_12671)"
          stroke="url(#paint1_linear_11869_12671)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_11869_12671"
            x1="200"
            y1="40"
            x2="200"
            y2="360"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_11869_12671"
            x1="200"
            y1="40"
            x2="200"
            y2="360"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
    </IconAvatar>
  )
}
