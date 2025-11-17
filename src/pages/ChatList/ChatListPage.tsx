import React, { useState, useEffect } from "react";
import { List, Avatar, Card, Typography, Spin, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import type { Chat } from "../../api/types";
import WebApp from "@twa-dev/sdk";
import styles from "./styles/ChatListPage.module.scss";

const { Title, Text } = Typography;

const ChatListPage: React.FC = () => {
  const { goBack } = useAppNavigation();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

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
        message.error("Не удалось определить пользователя");
        setLoading(false);
        return;
      }

      const response = await apiClient.getChats(telegramId);
      if (response.success && response.data) {
        setChats(response.data);
      } else {
        message.error(response.error || "Не удалось загрузить чаты");
      }
    } catch (err) {
      message.error("Ошибка при загрузке чатов");
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
      message.error("Не удалось открыть чат в Telegram");
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
            "Пациент"
        : "Пациент";
    } else {
      return chat.doctor
        ? `${chat.doctor.firstName || ""} ${chat.doctor.lastName || ""}`.trim() ||
            chat.doctor.username ||
            "Врач"
        : "Врач";
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
    return serviceType === "analysis" ? "Расшифровка анализов" : "Консультация";
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
          {user?.role === "DOCTOR" ? "Мои пациенты" : "Мои врачи"}
        </Title>

        {chats.length === 0 ? (
          <div className={styles.empty}>
            <MessageOutlined className={styles.emptyIcon} />
            <Text className={styles.emptyText}>
              {user?.role === "DOCTOR"
                ? "У вас пока нет пациентов"
                : "У вас пока нет чатов с врачами"}
            </Text>
          </div>
        ) : (
          <List
            dataSource={chats}
            renderItem={(chat: Chat) => (
              <List.Item
                className={styles.chatItem}
                onClick={() => handleOpenChat(chat)}
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
                          ? "Активен"
                          : chat.status === "COMPLETED"
                            ? "Завершен"
                            : "Отменен"}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default ChatListPage;
