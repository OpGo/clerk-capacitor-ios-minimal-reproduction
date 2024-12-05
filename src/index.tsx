import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
/* Core Ionic framework styles */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/structure.css"

import "./variables.css"
import { IonApp, setupIonicReact } from "@ionic/react"

setupIonicReact()

const container = document.getElementById("root")

if (container) {
    const root = createRoot(container)
    root.render(
        <StrictMode>
            <IonApp>
                <App />
            </IonApp>
        </StrictMode>,
    )
}
