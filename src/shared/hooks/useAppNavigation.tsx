import { useNavigate } from "react-router";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goTo: (path: string) => {
      navigate(path);
    },
    goBack: () => {
      navigate(-1);
    },
  };
};
