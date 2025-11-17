import { Navigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Loader } from "../../shared/ui/Loader/Loader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLogin, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen text="Загрузка..." size="large" />;
  }

  if (!isLogin) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};
