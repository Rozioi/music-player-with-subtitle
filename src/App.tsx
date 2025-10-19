import { useEffect } from "react";
import "./App.css";
import { useTelegram } from "./app/providers/useTelegram";
import { OnBoardingPage } from "./pages/Onboarding/ui/Onboarding";

function App() {
  const { user, isReady } = useTelegram();
  useEffect(() => {
    console.log(user?.username);
  }, []);
  if (!isReady) return <div>Загрузка Telegram...</div>;

  return (
    <>
      <OnBoardingPage />
    </>
  );
}

export default App;
