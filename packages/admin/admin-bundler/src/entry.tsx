import { render } from "@medusajs/dashboard";
import "./index.css";

render(
    document.getElementById("medusa"),
)

if (import.meta.hot) {
    import.meta.hot.accept()
}
