export const getCurrentOs = () => {
    switch (process.platform) {
        case "darwin":
            return "macos";
        case "linux":
            return "linux";
        default:
            return "windows";
    }
};
