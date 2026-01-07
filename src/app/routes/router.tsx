import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { Loader } from "../../shared/ui/Loader/Loader";
import AudioPage from "../../pages/Audio/AudioPage";

const LoadingFallback = () => (
  <Loader fullScreen text="Загрузка..." size="large" />
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AudioPage />,
  },
]);
