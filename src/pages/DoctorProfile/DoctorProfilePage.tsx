import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { DoctorProfile } from "./DoctorProfile";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { apiClient } from "../../api/api";
import { Loader } from "../../shared/ui/Loader/Loader";
import type { DoctorProfile as DoctorProfileType } from "../../api/types";
import { extractIdFromSlug } from "../../shared/utils/slug";

interface MappedDoctorData {
  name: string;
  specialty: string;
  experience: string;
  reviews: string;
  price: string;
  rating: number;
  image: string;
  about: string;
}

const getExperienceText = (years: number): string => {
  if (years === 1) return "год";
  if (years >= 2 && years <= 4) return "года";
  return "лет";
};

export const DoctorProfilePage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { goBack, goTo } = useAppNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<MappedDoctorData | null>(null);
  const [doctorId, setDoctorId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      let doctorId: string | null = null;

      if (slug) {
        doctorId = extractIdFromSlug(slug);
        if (!doctorId) {
          setError("Неверный формат ссылки на профиль врача");
          setLoading(false);
          return;
        }
      } else if (id) {
        doctorId = id;
      } else {
        setError("ID врача не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDoctorById(doctorId);

        if (response.success && response.data) {
          const doctor = response.data as DoctorProfileType;
          const mappedData: MappedDoctorData = {
            name: doctor.user
              ? `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
                doctor.user.username ||
                "Врач"
              : "Врач",
            specialty:
              typeof doctor.specialization === "object"
                ? (doctor.specialization as any)?.name || "Специалист"
                : doctor.specialization || "Специалист",
            experience: `${Number(doctor.experience || 0)} ${getExperienceText(
              Number(doctor.experience || 0),
            )}`,
            reviews: "0",
            price: `${Number(doctor.consultationFee || 0).toLocaleString("ru-RU")} ₸`,
            rating: Number(doctor.rating) || 0,
            image: doctor.user?.photoUrl || "https://i.pravatar.cc/300?img=60",
            about: doctor.description || "Информация о враче отсутствует",
          };

          setDoctorData(mappedData);
          setDoctorId(doctor.id);
        } else {
          setError(response.error || "Врач не найден");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Ошибка при загрузке данных врача";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, slug]);

  if (loading) {
    return <Loader fullScreen text="Загрузка профиля врача..." size="large" />;
  }

  if (error || !doctorData) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "16px", color: "#666" }}>
          {error || "Врач не найден"}
        </p>
        <button
          onClick={goBack}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  const handleStartChat = () => {
    if (doctorId) {
      goTo(`/payment?doctorId=${String(doctorId)}&serviceType=consultation`);
    }
  };

  return (
    <DoctorProfile
      {...doctorData}
      doctorId={doctorId || undefined}
      onBack={goBack}
      onStartChat={handleStartChat}
    />
  );
};
