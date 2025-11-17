import { useEffect } from "react";
import "./App.css";
import { useTelegram } from "./app/providers/useTelegram";
import { Router } from "./app/router";

function App() {
  const { isReady } = useTelegram();

  if (!isReady) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Загрузка Telegram...</div>
      </div>
    );
  }

  return <Router />;
}

export default App;
