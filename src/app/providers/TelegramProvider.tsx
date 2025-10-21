import { createContext, type ReactNode, type FC } from "react";
import {
  useTelegramWebApp,
  type TelegramData,
} from "../../processes/telegram-integration/useTelegramWebApp";

export const TelegramContext = createContext<TelegramData | null>(null);

export const TelegramProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const data = useTelegramWebApp();
  return (
    <TelegramContext.Provider value={data}>{children}</TelegramContext.Provider>
  );
};
