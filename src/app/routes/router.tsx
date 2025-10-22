import { createBrowserRouter } from "react-router";
import { MainLayout } from "../../layouts/MainLayout";
import LoginPage from "../../pages/Autheticated/ui/LoginPage";
import Main from "../../pages/Main/Main";
import AnalysisSelectionPage from "../../pages/AnalysisSelectionPage/AnalysisSelectionPage";
import DoctorSearchPage from "../../pages/DoctorSearch/DoctorSearch";
import PersonalAccountPage from "../../pages/PersonalAccount/PersonalAccountPage";
import RefundPolicyPage from "../../pages/PersonalAccount/RefundPolicyPage";
import { DoctorProfilePage } from "../../pages/DoctorProfile/DoctorProfilePage";
import RegisterPage from "../../pages/Autheticated/ui/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Main /> },
      { path: "home", element: <Main /> },
      { path: "analyses", element: <AnalysisSelectionPage /> },
      { path: "search", element: <DoctorSearchPage /> },
      { path: "chat", element: <div>Чат</div> },
      { path: "profile", element: <PersonalAccountPage /> },
      { path: "profile/:slug", element: <RefundPolicyPage /> },
      { path: "search/doctor/:id", element: <DoctorProfilePage /> },

      { path: "*", element: <div onClick={() => {}}>back</div> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <RegisterPage />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
]);
