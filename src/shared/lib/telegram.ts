import WebApp from "@twa-dev/sdk";
export const tg = WebApp;

export const getTelegramUser = () => {
  return tg.initDataUnsafe?.user || null;
};

export const getTelegramTheme = () => {
  try {
    return tg.themeParams || {};
  } catch {
    return {};
  }
};
