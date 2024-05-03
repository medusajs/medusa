// This config file includes the base configurations with the modified configs for UI docs
import coreConfig from "./base.tailwind.config"

// modify core spacing to have "docs" prefix
const modifiedSpacing = {}
Object.entries(coreConfig.theme.spacing).forEach(([key, value]) => {
  modifiedSpacing[`docs_${key}`] = value
})

// modify core border radius to have "docs" prefix
const modifiedRadius = {}
Object.entries(coreConfig.theme.extend.borderRadius).forEach(([key, value]) => {
  modifiedRadius[`docs_${key}`] = value
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  theme: {
    ...coreConfig.theme,
    extend: {
      ...coreConfig.theme.extend,
      borderRadius: {
        ...coreConfig.theme.extend.borderRadius,
        ...modifiedRadius,
      },
    },
    spacing: {
      ...coreConfig.theme.spacing,
      ...modifiedSpacing,
    },
  },
}
