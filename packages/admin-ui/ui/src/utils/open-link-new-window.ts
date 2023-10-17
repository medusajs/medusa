const openUrlNewWindow = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel="noopener noreferrer";
    link.click();
}

export default openUrlNewWindow;