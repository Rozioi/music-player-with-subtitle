import { useState, useCallback } from "react";
import { useTelegram } from "../../../app/providers/useTelegram";
import { authService } from "../../../api/services/auth.service";
import type { Role, User } from "../../../api/types";

export interface DoctorFormData {
  specialization: string;
  qualification: string;
  experience: number;
  description: string;
  education: string;
  certificates: string[];
  consultationFee: number;
  country: string;
}

const initialDoctorData: DoctorFormData = {
  specialization: "",
  qualification: "",
  experience: 0,
  description: "",
  education: "",
  certificates: [],
  consultationFee: 0,
  country: "",
};

export const useRegistration = () => {
  const { user: telegramUser } = useTelegram();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!telegramUser) {
      setError("Telegram user data is not available");
      return false;
    }

    if (isSubmitting) return false;

    setIsSubmitting(true);
    setError(null);

    try {
      const createdUser = await authService.createUser({
        telegramData: {
          user: telegramUser,
          auth_date: Math.floor(Date.now() / 1000),
          hash: window.Telegram?.WebApp?.initDataUnsafe?.hash || "",
        },
        role: "PATIENT",
        phoneNumber: phoneNumber || undefined,
      });

      setUser(createdUser);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [telegramUser, phoneNumber, isSubmitting]);

  return {
    phoneNumber,
    setPhoneNumber,
    isSubmitting,
    error,
    user,
    handleSubmit,
  };
};
