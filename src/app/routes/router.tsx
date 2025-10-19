import { createBrowserRouter } from "react-router";
import App from "../../App";
import { MainLayout } from "../../layouts/MainLayout";
import LoginPage from "../../pages/Autheticated/LoginPage";
import Main from "../../pages/Main/Main";
import AnalysisSelectionPage from "../../pages/AnalysisSelectionPage/AnalysisSelectionPage";
import DoctorSearchPage from "../../pages/DoctorSearch/DoctorSearch";

export const router = createBrowserRouter([
  {
    path: "/", // корневая обёртка
    element: <MainLayout />,
    children: [
      { index: true, element: <Main /> }, // рендер при /
      { path: "home", element: <Main /> },
      { path: "analyses", element: <AnalysisSelectionPage /> },
      { path: "search", element: <DoctorSearchPage /> },
      { path: "chat", element: <div>Чат</div> },
      { path: "profile", element: <div>Профиль</div> },
      { path: "*", element: <div onClick={() => {}}>back</div> },
    ],
  },
  {
    path: "/login",
    element: <App />,
    children: [{ index: true, element: <LoginPage /> }],
  },
]);
