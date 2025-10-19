import React, { createContext, type ReactNode } from "react";
import {
  useTelegramWebApp,
  type TelegramData,
} from "../../processes/telegram-integration/useTelegramWebApp";

export const TelegramContext = createContext<TelegramData | null>(null);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const data = useTelegramWebApp();
  return (
    <TelegramContext.Provider value={data}>{children}</TelegramContext.Provider>
  );
};
