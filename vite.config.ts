import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "rozioi.pro",
      "madly-modern-brill.cloudpub.ru",
      "rampantly-reasonable-millipede.cloudpub.ru",
    ],
  },
  assetsInclude: ["**/*.md"],
  build: {
    // Оптимизация сборки
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Удаляет console.log в production
        drop_debugger: true,
      },
    },
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем vendor библиотеки на отдельные чанки
          "react-vendor": ["react", "react-dom", "react-router"],
          "ui-vendor": ["antd"],
          "query-vendor": ["@tanstack/react-query"],
          "telegram-vendor": ["@twa-dev/sdk"],
        },
      },
    },
    // Оптимизация размера чанков
    chunkSizeWarningLimit: 1000,
    // Включение source maps только для production debugging
    sourcemap: false,
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "@tanstack/react-query",
      "antd",
      "@twa-dev/sdk",
    ],
  },
});
