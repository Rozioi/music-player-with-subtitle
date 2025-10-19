import { useEffect, useState } from "react";
import {
  tg,
  getTelegramUser,
  getTelegramTheme,
} from "../../shared/lib/telegram";

export interface TelegramData {
  user: ReturnType<typeof getTelegramUser> | null;
  theme: Record<string, any>;
  isReady: boolean;
}

export const useTelegramWebApp = (): TelegramData => {
  const [user, setUser] = useState(getTelegramUser());
  const [theme, setTheme] = useState(getTelegramTheme());
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    try {
      tg.ready();

      console.log("Telegram initDataUnsafe:", tg.initDataUnsafe);

      setUser(getTelegramUser());
      setTheme(getTelegramTheme());
      setReady(true);

      const themeHandler = () => setTheme(getTelegramTheme());
      tg.onEvent("themeChanged", themeHandler);

      return () => tg.offEvent("themeChanged", themeHandler);
    } catch (err) {
      console.error("Telegram SDK init error:", err);

      setUser(getTelegramUser());
      setTheme(getTelegramTheme());
      setReady(true);
    }
  }, []);

  return { user, theme, isReady };
};
