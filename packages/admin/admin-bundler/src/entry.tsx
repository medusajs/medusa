import { render } from "@medusajs/dashboard";
import config from "virtual:medusa/extensions";
import "./index.css";

render(
    document.getElementById("medusa"),
    {
        config
    }
)

if (import.meta.hot) {
    import.meta.hot.accept()
}
