import React, { useState, useEffect } from "react";
import { List, Avatar, Card, Typography, Spin, message, Button } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import type { Chat, Review } from "../../api/types";
import WebApp from "@twa-dev/sdk";
import styles from "./styles/ChatListPage.module.scss";
import { useTranslation } from "react-i18next";
import { ReviewModal } from "../../shared/ui/ReviewModal/ReviewModal";

const { Title, Text } = Typography;

const ChatListPage: React.FC = () => {
  const { goBack } = useAppNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [reviews, setReviews] = useState<Record<number, Review>>({});

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const telegramId =
        user?.telegramId ||
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();

      if (!telegramId) {
        message.error(t("chats.errors.unknownUser", "Не удалось определить пользователя"));
        setLoading(false);
        return;
      }

      const response = await apiClient.getChats(telegramId);
      if (response.success && response.data) {
        // Показываем активные и завершенные чаты (для возможности оставить отзыв)
        const visibleChats = response.data.filter(
          (chat) => chat.status === "ACTIVE" || chat.status === "COMPLETED",
        );
        setChats(visibleChats);

        // Загружаем отзывы для завершенных чатов
        const completedChats = response.data.filter(
          (chat) => chat.status === "COMPLETED",
        );
        for (const chat of completedChats) {
          if (chat.id) {
            const reviewResponse = await apiClient.getReviewByChat(chat.id);
            if (reviewResponse.success && reviewResponse.data) {
              setReviews((prev: Record<number, Review>) => ({ ...prev, [chat.id]: reviewResponse.data! }));
            }
          }
        }
      } else {
        message.error(
          response.error || t("chats.errors.loadError", "Не удалось загрузить чаты"),
        );
      }
    } catch (err) {
      message.error(t("chats.errors.loadError", "Ошибка при загрузке чатов"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (chat: Chat) => {
    try {
      const botUsername = "LumoMarket_bot";

      if (chat.telegramChatId) {
        const chatUrl = `https://t.me/${botUsername}?start=${chat.telegramChatId}`;
        openTelegramLink(chatUrl);
      } else {
        const chatUrl = `https://t.me/${botUsername}?start=chat_${chat.id}`;
        openTelegramLink(chatUrl);
      }
    } catch (error) {
      console.error("Ошибка при открытии чата:", error);
      message.error(t("chats.errors.openError", "Не удалось открыть чат в Telegram"));
    }
  };

  const openTelegramLink = (url: string) => {
    if (typeof WebApp !== "undefined" && WebApp.openLink) {
      WebApp.openLink(url);
    } else if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const getChatTitle = (chat: Chat) => {
    if (user?.role === "DOCTOR") {
      return chat.patient
        ? `${chat.patient.firstName || ""} ${chat.patient.lastName || ""}`.trim() ||
            chat.patient.username ||
            t("chats.patient", "Пациент")
        : t("chats.patient", "Пациент");
    } else {
      return chat.doctor
        ? `${chat.doctor.firstName || ""} ${chat.doctor.lastName || ""}`.trim() ||
            chat.doctor.username ||
            t("chats.doctor", "Врач")
        : t("chats.doctor", "Врач");
    }
  };

  const getChatAvatar = (chat: Chat) => {
    if (user?.role === "DOCTOR") {
      return chat.patient?.photoUrl || "https://i.pravatar.cc/150?img=60";
    } else {
      return chat.doctor?.photoUrl || "https://i.pravatar.cc/150?img=60";
    }
  };

  const getServiceTypeText = (serviceType: string) => {
    return serviceType === "analysis"
      ? t("chats.analysis", "Расшифровка анализов")
      : t("chats.consultation", "Консультация");
  };

  const getDoctorProfileId = (chat: Chat): number | null => {
    // В Chat должен быть doctor с doctorProfile
    if (chat.doctor?.doctorProfile?.id) {
      return chat.doctor.doctorProfile.id;
    }
    // Если нет в данных, пытаемся получить через API врача
    // Но для этого нужен doctorId, который у нас есть
    // Пока возвращаем null и показываем ошибку
    return null;
  };

  const handleReviewClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    const doctorProfileId = getDoctorProfileId(chat);
    if (!doctorProfileId) {
      message.error(t("review.errors.doctorNotFound", "Не удалось найти профиль врача"));
      return;
    }
    setSelectedChat(chat);
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = (review: Review) => {
    if (selectedChat) {
      setReviews((prev: Record<number, Review>) => ({ ...prev, [selectedChat.id]: review }));
    }
    setReviewModalOpen(false);
    setSelectedChat(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>

      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {user?.role === "DOCTOR"
            ? t("chats.myPatients", "Мои пациенты")
            : t("chats.myDoctors", "Мои врачи")}
        </Title>

        {chats.length === 0 ? (
          <div className={styles.empty}>
            <MessageOutlined className={styles.emptyIcon} />
            <Text className={styles.emptyText}>
              {user?.role === "DOCTOR"
                ? t("chats.emptyDoctor", "У вас пока нет пациентов")
                : t("chats.empty", "У вас пока нет чатов с врачами")}
            </Text>
          </div>
        ) : (
          <List
            dataSource={chats}
            renderItem={(chat: Chat) => (
              <List.Item
                className={styles.chatItem}
                onClick={() => {
                  if (chat.status === "ACTIVE") {
                    handleOpenChat(chat);
                  }
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={getChatAvatar(chat)}
                      size={50}
                      className={styles.avatar}
                    />
                  }
                  title={
                    <div className={styles.chatTitle}>
                      <Text strong>{getChatTitle(chat)}</Text>
                      <Text className={styles.serviceType}>
                        {getServiceTypeText(chat.serviceType)}
                      </Text>
                    </div>
                  }
                  description={
                    <div className={styles.chatDescription}>
                      <Text className={styles.amount}>
                        {Number(chat.amount).toLocaleString("ru-RU")} ₸
                      </Text>
                      <Text className={styles.status}>
                        {chat.status === "ACTIVE"
                          ? t("chats.active", "Активен")
                          : chat.status === "COMPLETED"
                            ? t("chats.completed", "Завершен")
                            : t("chats.cancelled", "Отменен")}
                      </Text>
                    </div>
                  }
                  actions={
                    chat.status === "COMPLETED" && !reviews[chat.id] && user?.role === "PATIENT"
                      ? [
                          <Button
                            key="review"
                            type="link"
                            icon={<StarOutlined />}
                            onClick={(e: React.MouseEvent) => handleReviewClick(e, chat)}
                            size="small"
                          >
                            {t("review.leaveReview", "Оставить отзыв")}
                          </Button>,
                        ]
                      : []
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {selectedChat && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedChat(null);
          }}
          doctorProfileId={getDoctorProfileId(selectedChat) || 0}
          chatId={selectedChat.id}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default ChatListPage;
