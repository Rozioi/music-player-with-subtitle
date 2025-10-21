import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { TelegramProvider } from "./app/providers/TelegramProvider";
import { RouterProvider } from "react-router";
import { router } from "./app/routes/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TelegramProvider>
      <RouterProvider router={router} />
    </TelegramProvider>
  </StrictMode>,
);
