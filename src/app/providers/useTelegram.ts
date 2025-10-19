import { useContext } from "react";
import { TelegramContext } from "./TelegramProvider";

export const useTelegram = () => {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error("useTelegram must be used within TelegramProvider");
  return ctx;
};
