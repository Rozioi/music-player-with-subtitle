import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Tag,
  Divider,
  message,
  Modal,
} from "antd";
import {
  DollarOutlined,
  MedicineBoxOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

import styles from "./styles/PersonalAccountPage.module.scss";
import ProfileUpload from "./ui/ProfileUpload";
import InfoLinks from "./ui/InfoLinks";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
const { Title, Text } = Typography;

const PersonalAccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance] = useState(14000);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [card] = useState("Visa **** 9399");
  const [doctorProfile, setDoctorProfile] = useState<{
    id: number;
    consultationFee: number | string;
    description: string;
    specialization?: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConsultationFee, setEditedConsultationFee] = useState(0);
  const [editedDescription, setEditedDescription] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { goBack } = useAppNavigation();

  useEffect(() => {
    if (user) {
      const fullName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || user.username || "Пользователь";
      setName(fullName);
      setPhone(user.phoneNumber || "");

      if (user.role === "DOCTOR" && user.id) {
        loadDoctorProfile(user.id);
      }
    } else {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
        const fullName =
          telegramUser.first_name && telegramUser.last_name
            ? `${telegramUser.first_name} ${telegramUser.last_name}`
            : telegramUser.first_name ||
              telegramUser.username ||
              "Пользователь";
        setName(fullName);
      }
    }
  }, [user]);

  const loadDoctorProfile = async (userId: string | number) => {
    try {
      const response = await apiClient.getDoctorByUserId(userId);
      if (response.success && response.data) {
        setDoctorProfile(response.data);
        setEditedConsultationFee(Number(response.data.consultationFee) || 0);
        setEditedDescription(response.data.description || "");
      }
    } catch (err) {
      // Можно добавить логирование в production
    }
  };

  const handleSaveDoctorProfile = async () => {
    if (!doctorProfile?.id) return;

    if (editedConsultationFee < 0) {
      message.error("Стоимость консультации не может быть отрицательной");
      return;
    }

    if (!editedDescription.trim() || editedDescription.trim().length < 10) {
      message.error("Описание должно содержать минимум 10 символов");
      return;
    }

    try {
      const response = await apiClient.updateDoctor(doctorProfile.id, {
        consultationFee: editedConsultationFee,
        description: editedDescription.trim(),
      });

      if (response.success && response.data) {
        setDoctorProfile(response.data);
        setIsEditing(false);
        message.success("Профиль успешно обновлен");
      } else {
        message.error(response.error || "Ошибка при обновлении профиля");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при обновлении профиля";
      message.error(errorMessage);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      message.success("Вы успешно вышли из аккаунта");
      setShowLogoutModal(false);
      navigate("/login");
    } catch (err) {
      message.error("Ошибка при выходе из аккаунта");
    } finally {
      setLogoutLoading(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className={styles.container}>
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          Личный кабинет
        </Title>

        <div className={styles.balanceBox}>
          <div className={styles.balanceText}>
            <Text className={styles.balanceAmount}>
              {balance.toLocaleString()} ₸
            </Text>
            <Button type="link" className={styles.topUp}>
              Пополнить
            </Button>
          </div>
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>Имя</Text>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            suffix={<Button type="link">Изменить</Button>}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>Номер телефона</Text>
          <Input
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            suffix={<Button type="link">Изменить</Button>}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>Карта оплаты</Text>
          <Input
            value={card}
            disabled
            suffix={<Button type="link">Изменить</Button>}
          />
        </div>

        {user?.role === "DOCTOR" && doctorProfile && (
          <>
            <Divider orientation="left" style={{ margin: "24px 0" }}>
              <Tag
                icon={<MedicineBoxOutlined />}
                color="blue"
                style={{ fontSize: "14px", padding: "4px 12px" }}
              >
                Профиль врача
              </Tag>
            </Divider>

            <div className={styles.field}>
              <Text className={styles.label}>
                <MedicineBoxOutlined /> Специализация
              </Text>
              <Input
                value={doctorProfile.specialization || ""}
                disabled
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>

            <div className={styles.field}>
              <Text className={styles.label}>
                <DollarOutlined /> Стоимость консультации (₸)
              </Text>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedConsultationFee}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditedConsultationFee(parseFloat(e.target.value) || 0)
                  }
                  suffix={
                    <Button type="link" onClick={handleSaveDoctorProfile}>
                      Сохранить
                    </Button>
                  }
                />
              ) : (
                <Input
                  value={`${Number(doctorProfile.consultationFee || 0).toLocaleString("ru-RU")} ₸`}
                  disabled
                  suffix={
                    <Button type="link" onClick={() => setIsEditing(true)}>
                      Изменить
                    </Button>
                  }
                />
              )}
            </div>

            <div className={styles.field}>
              <Text className={styles.label}>О себе</Text>
              {isEditing ? (
                <Input.TextArea
                  value={editedDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditedDescription(e.target.value)
                  }
                  rows={4}
                  style={{ backgroundColor: "#f6f8ff" }}
                />
              ) : (
                <Input.TextArea
                  value={doctorProfile.description || ""}
                  disabled
                  rows={4}
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              )}
            </div>

            {isEditing && (
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}
              >
                <Button
                  type="primary"
                  onClick={handleSaveDoctorProfile}
                  style={{ flex: 1 }}
                >
                  Сохранить изменения
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedConsultationFee(
                      Number(doctorProfile.consultationFee) || 0,
                    );
                    setEditedDescription(doctorProfile.description || "");
                  }}
                  style={{ flex: 1 }}
                >
                  Отмена
                </Button>
              </div>
            )}
          </>
        )}

        <ProfileUpload />
        <Button type="primary" block className={styles.saveBtn}>
          Сохранить
        </Button>
        <InfoLinks />

        <Divider style={{ margin: "24px 0" }} />

        <Button
          type="default"
          danger
          block
          icon={<LogoutOutlined />}
          className={styles.logoutButton}
          onClick={handleLogout}
          loading={logoutLoading}
        >
          Выйти из аккаунта
        </Button>
      </Card>

      <Modal
        title="Выход из аккаунта"
        open={showLogoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Выйти"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: logoutLoading }}
        confirmLoading={logoutLoading}
        centered
      >
        <p>Вы уверены, что хотите выйти из аккаунта?</p>
      </Modal>
    </div>
  );
};

export default PersonalAccountPage;
