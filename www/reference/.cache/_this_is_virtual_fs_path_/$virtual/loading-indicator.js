
    export function isLoadingIndicatorEnabled() {
    return `Cypress` in window
          ? false
          : true
  }