import openUrlNewWindow from "./open-link-new-window";

const openRelativeUrlNewWindow = (url: string) => {
    let admin_path = String(process.env.ADMIN_PATH || '/').replace(/\/+$/, '');
    url = admin_path + '/' + url.replace(/^\/+/, '');
    openUrlNewWindow(url);
}

export default openRelativeUrlNewWindow;