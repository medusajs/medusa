const isBrowserLocaleClockType24h = () => {
    const language = typeof window !== "undefined" ? window.navigator.language : "en-US";
    const hr = new Intl.DateTimeFormat(language, {
        hour: "numeric",
    }).format();
    return Number.isInteger(Number(hr));
};
export { isBrowserLocaleClockType24h };
//# sourceMappingURL=is-browser-locale-hour-cycle-24h.js.map