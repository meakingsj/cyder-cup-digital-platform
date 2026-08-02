import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
<StrictMode>
  <App />
  <Analytics />
  <SpeedInsights />
</StrictMode>
);