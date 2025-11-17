import { useCallback, useEffect, useState } from "react";
import type {
  ApiResponse,
  CreateDoctorRequest,
  CreateUserRequest,
  Role,
  TelegramInitData,
  User,
} from "../api/types";
import { apiClient } from "../api/api";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: TelegramInitData;
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

export const useAuthReq = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      // Инициализация Telegram WebApp
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    setLoading(false);
  }, []);

  const createUser = useCallback(
    async (role: Role, phoneNumber?: string): Promise<ApiResponse<User>> => {
      if (!window.Telegram?.WebApp) {
        return {
          success: false,
          error: "Telegram WebApp is not available",
        };
      }

      try {
        const telegramData = window.Telegram.WebApp.initDataUnsafe;

        if (!telegramData.user) {
          return {
            success: false,
            error: "No user data available from Telegram",
          };
        }

        const createUserData: CreateUserRequest = {
          telegramData,
          role,
          phoneNumber,
        };

        const response = await apiClient.createUser(createUserData);

        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(response.error || "Failed to create user");
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [],
  );
  const createDoctor = useCallback(
    async (
      doctorData: Omit<CreateDoctorRequest, "telegramData" | "phoneNumber">,
      phoneNumber: string,
    ): Promise<ApiResponse<any>> => {
      if (!window.Telegram?.WebApp) {
        return {
          success: false,
          error: "Telegram WebApp is not available",
        };
      }

      try {
        const telegramData = window.Telegram.WebApp.initDataUnsafe?.user;

        if (!telegramData) {
          return {
            success: false,
            error: "No user data available from Telegram",
          };
        }

        // ✅ Собираем всё как ожидает бэкенд
        const createDoctorData = {
          user: {
            telegramData,
            phoneNumber: phoneNumber,
          },
          doctor: {
            ...doctorData,
            specialization:
              doctorData.specialization || doctorData.qualification, // fallback
          },
        };

        const response = await apiClient.createDoctor(createDoctorData);

        if (!response.success) {
          setError(response.error || "Failed to create doctor profile");
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [],
  );

  const closeWebApp = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  }, []);

  const login = useCallback(
    async (phoneNumber: string): Promise<ApiResponse<User>> => {
      if (!window.Telegram?.WebApp) {
        return {
          success: false,
          error: "Telegram WebApp is not available",
        };
      }

      try {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

        if (!telegramUser) {
          return {
            success: false,
            error: "No user data available from Telegram",
          };
        }

        const loginData = {
          telegramData: {
            id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            photo_url: telegramUser.photo_url,
          },
          phoneNumber,
        };

        const response = await apiClient.loginUser(loginData);

        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(response.error || "Failed to login");
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    createUser,
    createDoctor,
    login,
    logout,
    closeWebApp,
    clearError,
  };
};
