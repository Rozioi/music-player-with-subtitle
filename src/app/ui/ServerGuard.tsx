import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../api/api";
import { Loader } from "../../shared/ui/Loader/Loader";

export const ServerGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await apiClient.checkedServer();

        if (!res.success) {
          navigate("/tech", { replace: true });
          return;
        }
      } catch (e) {
        navigate("/tech", { replace: true });
        return;
      }

      setLoading(false);
    };

    checkServer();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Проверка сервера..." size="large" />;
  }

  return children;
};
