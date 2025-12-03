import { useState, useEffect } from "react";
import { Switch, Button, Typography, Space, ConfigProvider, Card, Avatar, Spin } from "antd";
import { DoctorCard } from "../../shared/ui/DoctorCard/DoctorCard";
import styles from "./styles/AnalysisSelectionPage.module.scss";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { SuccessModal } from "../../shared/ui/Modal/Modal";
import { FaCheck } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import type { Chat, DoctorProfile, DoctorCardData } from "../../api/types";
import { useTranslation } from "react-i18next";
import WebApp from "@twa-dev/sdk";

const { Title, Text } = Typography;

const AnalysisSelectionPage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([
    "blood",
    "urine",
    "stool",
  ]);
  const [doctorsWithChats, setDoctorsWithChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const { goTo } = useAppNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    loadDoctorsWithChats();
  }, []);

  const loadDoctorsWithChats = async () => {
    try {
      setLoadingChats(true);
      const telegramId =
        user?.telegramId ||
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();

      if (!telegramId) {
        setLoadingChats(false);
        return;
      }

      const response = await apiClient.getChats(telegramId);
      if (response.success && response.data) {
        // Фильтруем только активные чаты с типом analysis
        const activeAnalysisChats = response.data.filter(
          (chat) => chat.status === "ACTIVE" && chat.serviceType === "analysis",
        );
        setDoctorsWithChats(activeAnalysisChats);
      }
    } catch (err) {
      console.error("Ошибка загрузки чатов:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  const handlePay = () => {
    if (selectedDoctor) {
      goTo(`/payment?doctorId=${selectedDoctor}&serviceType=analysis`);
    }
  };

  const handleOpenChat = (chat: Chat) => {
    try {
      const botUsername = "LumoMarket_bot";
      const chatUrl = chat.telegramChatId
        ? `https://t.me/${botUsername}?start=${chat.telegramChatId}`
        : `https://t.me/${botUsername}?start=chat_${chat.id}`;

      if (typeof WebApp !== "undefined" && WebApp.openLink) {
        WebApp.openLink(chatUrl);
      } else if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(chatUrl);
      } else {
        window.open(chatUrl, "_blank");
      }
    } catch (error) {
      console.error("Ошибка при открытии чата:", error);
    }
  };

  const analyses = [
    { label: t("analysis.blood", "Общий анализ крови"), key: "blood" },
    { label: t("analysis.bio", "Биохимия крови"), key: "bio" },
    { label: t("analysis.urine", "Общий анализ мочи"), key: "urine" },
    { label: t("analysis.stool", "Копрограмма (общий анализ кала)"), key: "stool" },
  ];

  const [doctors, setDoctors] = useState<DoctorCardData[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
      Германия: "🇩🇪",
      Germany: "🇩🇪",
      Франция: "🇫🇷",
      France: "🇫🇷",
      Россия: "🇷🇺",
      Russia: "🇷🇺",
      Казахстан: "🇰🇿",
      Kazakhstan: "🇰🇿",
    };
    return flags[country] || "🌍";
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await apiClient.getDoctors();
      if (response.success && response.data) {
        const formattedDoctors: DoctorCardData[] = response.data.map(
          (doctor) => {
            const doctorProfile = doctor as unknown as DoctorProfile;
            return {
              id: String(doctorProfile.id),
              name: doctorProfile.user
                ? `${doctorProfile.user.firstName || ""} ${doctorProfile.user.lastName || ""}`.trim() ||
                  doctorProfile.user.username ||
                  t("chats.doctor", "Врач")
                : t("chats.doctor", "Врач"),
              country: doctorProfile.country || "",
              countryFlag: getCountryFlag(doctorProfile.country || ""),
              rating: doctorProfile.rating ?? 0,
              image:
                doctorProfile.user?.photoUrl ||
                "https://i.pravatar.cc/150?img=60",
              category: doctorProfile.specialization || "",
              specialization: doctorProfile.specialization || "",
            };
          },
        );
        setDoctors(formattedDoctors);
      }
    } catch (err) {
      console.error("Ошибка загрузки врачей:", err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const toggleAnalysis = (key: string, checked: boolean) => {
    setSelectedAnalyses((prev) =>
      checked ? [...prev, key] : prev.filter((a) => a !== key),
    );
  };

  const { goBack } = useAppNavigation();

  const getDoctorName = (chat: Chat) => {
    return chat.doctor
      ? `${chat.doctor.firstName || ""} ${chat.doctor.lastName || ""}`.trim() ||
          chat.doctor.username ||
          t("chats.doctor", "Врач")
      : t("chats.doctor", "Врач");
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Switch: {
            colorPrimary: "#69D7B6",
            colorPrimaryHover: "#69D7B6",
            colorPrimaryActive: "#69D7B6",
          },
        },
      }}
    >
      <div className={styles.container}>
        <div onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </div>

        <Title level={5} className={styles.subtitle}>
          {t("analysis.title", "Выберите анализ и получите расшифровку онлайн:")}
        </Title>

        <Space direction="vertical" className={styles.switchList}>
          {analyses.map((a) => (
            <div key={a.key} className={styles.switchItem}>
              <Text>{a.label}</Text>
              <Switch
                checked={selectedAnalyses.includes(a.key)}
                onChange={(checked) => toggleAnalysis(a.key, checked)}
              />
            </div>
          ))}
        </Space>

        {doctorsWithChats.length > 0 && (
          <>
            <Title level={5} className={styles.subtitle}>
              {t("analysis.doctorsWithChats", "Врачи с которыми у вас есть чат:")}
            </Title>
            {loadingChats ? (
              <Spin />
            ) : (
              <div className={styles.chatsList}>
                {doctorsWithChats.map((chat) => (
                  <Card
                    key={chat.id}
                    className={styles.chatCard}
                    onClick={() => handleOpenChat(chat)}
                    hoverable
                  >
                    <div className={styles.chatCardContent}>
                      <Avatar
                        src={chat.doctor?.photoUrl || "https://i.pravatar.cc/150?img=60"}
                        size={40}
                      />
                      <div className={styles.chatCardInfo}>
                        <Text strong>{getDoctorName(chat)}</Text>
                        <Text type="secondary" className={styles.chatCardService}>
                          {t("chats.analysis", "Расшифровка анализов")}
                        </Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        <Title level={5} className={styles.subtitle}>
          {t("analysis.selectDoctor", "Выберите врача:")}
        </Title>

        {loadingDoctors ? (
          <Spin />
        ) : doctors.length === 0 ? (
          <Text type="secondary">
            {t("doctor.search.noResults", "Врачи не найдены")}
          </Text>
        ) : (
          <div className={styles.doctorList}>
            {doctors.map((d) => (
              <DoctorCard
                key={d.id}
                {...d}
                selected={selectedDoctor === d.id}
                onSelect={() => setSelectedDoctor(d.id)}
              />
            ))}
          </div>
        )}

        <Button
          type="primary"
          size="large"
          className={styles.payButton}
          block
          disabled={!selectedDoctor || selectedAnalyses.length === 0}
          onClick={handlePay}
        >
          {t("analysis.payButton", "Оплатить")}
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default AnalysisSelectionPage;
