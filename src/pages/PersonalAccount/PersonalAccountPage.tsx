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
import { useTranslation } from "react-i18next";
import { Select } from "antd";

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
  const { t, i18n } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [card] = useState("Visa **** 9399");
  const [language, setLanguage] = useState<"ru" | "en">("ru");
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { goBack } = useAppNavigation();

  useEffect(() => {
    try {
      const savedLang = (localStorage.getItem("lang") as "ru" | "en" | null) || "ru";
      setLanguage(savedLang === "en" || savedLang === "ru" ? savedLang : "ru");
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fullName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || user.username || t("profile.user");
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
            :               telegramUser.first_name ||
              telegramUser.username ||
              t("profile.user");
        setName(fullName);
      }
    }
  }, [user, t]);

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
      messageApi.error(t("profile.consultationFeeError"));
      return;
    }

    if (!editedDescription.trim() || editedDescription.trim().length < 10) {
      messageApi.error(t("profile.descriptionError"));
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
        messageApi.success(t("profile.profileUpdated"));
      } else {
        messageApi.error(response.error || t("profile.updateError"));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.messageApi : t("profile.updateError");
      messageApi.error(errorMessage);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmDelete = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      messageApi.success(t("profile.deleteSuccess"));
      setShowLogoutModal(false);
      navigate("/login");
    } catch (err) {
      messageApi.error(t("profile.deleteError"));
    } finally {
      setLogoutLoading(false);
    }
  };
  const hadleDelete = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      messageApi.success(t("profile.logoutSuccess"));
      setShowLogoutModal(false);
      navigate("/login");
    } catch (err) {
      messageApi.error(t("profile.logoutError"));
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
          {t("profile.title")}
        </Title>

        <div className={styles.balanceBox}>
          <div className={styles.balanceText}>
            <Text className={styles.balanceAmount}>
              {balance.toLocaleString()} ₸
            </Text>
            <Button type="link" className={styles.topUp}>
              {t("profile.topUp")}
            </Button>
          </div>
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.language")}</Text>
          <Select
            value={language === "ru" ? "Русский" : "English"}
            options={[
              { value: "Русский", label: "Русский" },
              { value: "English", label: "English" },
            ]}
            onChange={(value) => {
              if (value === "Русский") {
                setLanguage("ru");
                try {
                  localStorage.setItem("lang", "ru");
                } catch {
                  // ignore
                }
                i18n.changeLanguage("ru");
              } else if (value === "English") {
                setLanguage("en");
                try {
                  localStorage.setItem("lang", "en");
                } catch {
                  // ignore
                }
                i18n.changeLanguage("en");
              }
            }}
            style={{ width: "100%" }}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.name")}</Text>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            suffix={<Button type="link">{t("common.edit")}</Button>}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.phone")}</Text>
          <Input
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            suffix={<Button type="link">{t("common.edit")}</Button>}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>{t("profile.card")}</Text>
          <Input
            value={card}
            disabled
            suffix={<Button type="link">{t("common.edit")}</Button>}
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
                {t("profile.doctorProfile")}
              </Tag>
            </Divider>

            <div className={styles.field}>
              <Text className={styles.label}>
                <MedicineBoxOutlined /> {t("profile.specialization")}
              </Text>
              <Input
                value={doctorProfile.specialization || ""}
                disabled
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>

            <div className={styles.field}>
              <Text className={styles.label}>
                <DollarOutlined /> {t("profile.consultationFee")}
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
                      {t("common.save")}
                    </Button>
                  }
                />
              ) : (
                <Input
                  value={`${Number(doctorProfile.consultationFee || 0).toLocaleString("ru-RU")} ₸`}
                  disabled
                  suffix={
                    <Button type="link" onClick={() => setIsEditing(true)}>
                      {t("common.edit")}
                    </Button>
                  }
                />
              )}
            </div>

            <div className={styles.field}>
              <Text className={styles.label}>{t("profile.about")}</Text>
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
                  {t("profile.saveChanges")}
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
                  {t("profile.cancel")}
                </Button>
              </div>
            )}
          </>
        )}

        <ProfileUpload />
        <Button type="primary" block className={styles.saveBtn}>
          {t("common.save")}
        </Button>
        <InfoLinks />

        <Divider style={{ margin: "24px 0" }} />
        <Button
          type="default"
          danger
          block
          icon={<LogoutOutlined />}
          className={styles.logoutButton}
          onClick={hadleDelete}
          loading={logoutLoading}
        >
          {t("profile.deleteAccount")}
        </Button>
        <Button
          type="default"
          danger
          block
          icon={<LogoutOutlined />}
          className={styles.logoutButton}
          onClick={handleLogout}
          loading={logoutLoading}
        >
          {t("profile.logout")}
        </Button>
      </Card>
      <Modal
        title={t("profile.deleteAccountTitle")}
        open={showDeleteModal}
        onOk={confirmDelete}
        onCancel={cancelLogout}
        okText={t("common.delete")}
        cancelText={t("common.cancel")}
        okButtonProps={{ danger: true, loading: logoutLoading }}
        confirmLoading={logoutLoading}
        centered
      >
        <p>{t("profile.deleteAccountConfirm")}</p>
      </Modal>
      <Modal
        title={t("profile.logoutTitle")}
        open={showLogoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText={t("profile.logout")}
        cancelText={t("common.cancel")}
        okButtonProps={{ danger: true, loading: logoutLoading }}
        confirmLoading={logoutLoading}
        centered
      >
        <p>{t("profile.logoutConfirm")}</p>
      </Modal>
    </div>
  );
};

export default PersonalAccountPage;
