import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import '@rainbow-me/rainbowkit/styles.css'

import "./index.css"
import App from "./App.tsx"
import ContextProvider from "./context/index.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>
)
