import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Input,
  Button,
  Card,
  Typography,
  message,
  Radio,
  Modal,
  Checkbox,
} from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import { SuccessModal } from "../../shared/ui/Modal/Modal";
import WebApp from "@twa-dev/sdk";
import styles from "./styles/PaymentPage.module.scss";
import { PaymentIcons } from "../../shared/ui/PaymentIcons/PaymentIcons";
import { useAuthReq } from "../../hooks/useAuthReq";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { goBack } = useAppNavigation();
  const { user } = useAuth();
  const doctorIdParam = searchParams.get("doctorId");
  const serviceType = searchParams.get("serviceType") || "consultation";

  const [paymentMethod, setPaymentMethod] = useState<"card">("card");
  const [messageApi, contextHolder] = message.useMessage();
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);
  const [doctorData, setDoctorData] = useState<{
    name: string;
    price: number;
  } | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (doctorIdParam) loadDoctorData();
  }, [doctorIdParam, user]);

  const loadDoctorData = async () => {
    if (!doctorIdParam) return;
    try {
      const response = await apiClient.getDoctorById(doctorIdParam);
      if (response.success && response.data) {
        const doctor = response.data;
        const name = doctor.user
          ? `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
            doctor.user.username ||
            "Врач"
          : "Врач";
        const price = Number(doctor.consultationFee || 0);
        setDoctorData({ name, price });
      }
    } catch (err) {
      console.error("Ошибка загрузки данных врача:", err);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    return match.match(/.{1,4}/g)?.join(" ") || v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    return v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2, 4) : v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const checkActiveChat = async (doctorId: number): Promise<boolean> => {
    try {
      const telegramId =
        user?.telegramId ||
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
      if (!telegramId || !user?.id) return false;

      const response = await apiClient.getChats(telegramId);
      if (response.success && response.data) {
        const activeChat = response.data.find(
          (chat) =>
            chat.status === "ACTIVE" &&
            chat.doctorId === doctorId &&
            chat.serviceType ===
              (serviceType === "analysis" ? "analysis" : "consultation"),
        );
        return !!activeChat;
      }
      return false;
    } catch (err) {
      console.error("Ошибка проверки активного чата:", err);
      return false;
    }
  };

  const validateCardExpiry = (expiry: string): boolean => {
    if (!expiry || expiry.length !== 5) return false;
    const [month, year] = expiry.split("/");
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    if (monthNum < 1 || monthNum > 12) return false;
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    return true;
  };

  const handlePayment = async () => {
    if (!doctorIdParam || !doctorData) {
      messageApi.error(
        t("payment.errors.incompleteData", "Данные для оплаты неполные"),
      );
      return;
    }

    const validDoctorId = String(doctorIdParam).trim();
    if (!validDoctorId || isNaN(Number(validDoctorId))) {
      messageApi.error(
        t("payment.errors.invalidDoctorId", "Неверный ID врача"),
      );
      return;
    }

    const doctorIdNum = Number(validDoctorId);
    const amount = doctorData.price;

    const hasActiveChat = await checkActiveChat(doctorIdNum);
    if (hasActiveChat) {
      messageApi.error(
        t(
          "payment.errors.activeChatExists",
          "У вас уже есть активный чат с этим врачом. Завершите текущую консультацию перед началом новой.",
        ),
      );
      return;
    }

    // Валидация полей карты
    if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
      messageApi.error(
        t("payment.errors.invalidCardFields", "Заполните все поля карты"),
      );
      return;
    }

    const cardNumberClean = cardNumber.replace(/\s/g, "");
    if (cardNumberClean.length < 16) {
      messageApi.error(
        t(
          "payment.errors.invalidCardNumber",
          "Номер карты должен содержать 16 цифр",
        ),
      );
      return;
    }

    if (!validateCardExpiry(cardExpiry)) {
      messageApi.error(
        t("payment.errors.invalidCardExpiry", "Неверный срок действия карты"),
      );
      return;
    }

    if (cardCVC.length !== 3) {
      messageApi.error(
        t("payment.errors.invalidCardCVC", "CVC должен содержать 3 цифры"),
      );
      return;
    }

    if (!cardName.trim() || cardName.trim().length < 2) {
      messageApi.error(
        t("payment.errors.invalidCardName", "Введите имя на карте"),
      );
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const telegramId =
        user?.telegramId ||
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
      if (!telegramId) {
        messageApi.error(
          t("payment.errors.unknownUser", "Не удалось определить пользователя"),
        );
        setLoading(false);
        return;
      }

      const chatResponse = await apiClient.createChat({
        doctorId: doctorIdNum,
        serviceType: serviceType === "analysis" ? "analysis" : "consultation",
        amount,
        telegramId,
      });

      if (chatResponse.success) {
        await apiClient.sendChatInvite(user.id, doctorIdNum);
        setIsModalOpen(true);
      } else {
        messageApi.error(
          chatResponse.error ||
            t("payment.errors.createChatError", "Ошибка при создании чата"),
        );
      }
    } catch (err) {
      messageApi.error(
        t("payment.errors.processError", "Ошибка при обработке платежа"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToTelegramChat = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      WebApp?.close?.() || window.Telegram?.WebApp?.close?.();
    }, 500);
  };

  const getServiceName = () =>
    serviceType === "analysis"
      ? t("chats.analysis", "Расшифровка анализов")
      : t("chats.consultation", "Консультация");

  return (
    <div className={styles.container}>
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      {contextHolder}
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          {t("payment.title")}
        </Title>

        {doctorData && (
          <div className={styles.serviceInfo}>
            <Text className={styles.serviceName}>{getServiceName()}</Text>
            <Text className={styles.doctorName}>
              {t("chats.doctor", "Врач")}: {doctorData.name}
            </Text>
            <Text className={styles.price}>
              {doctorData.price.toLocaleString("ru-RU")} ₸
            </Text>
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <Text className={styles.label}>{t("payment.methodLabel")}</Text>
            <Radio.Group
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
              className={styles.paymentMethodGroup}
            >
              <Radio value="card" className={styles.paymentRadio}>
                <CreditCardOutlined /> {t("payment.methodCard")}
              </Radio>
            </Radio.Group>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className={styles.inputGroup}>
                <Text className={styles.label}>
                  {t("payment.cardNumber", "Номер карты")}
                </Text>
                <Input
                  prefix={<CreditCardOutlined />}
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className={styles.input}
                />
                <PaymentIcons cardNumber={cardNumber} />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <Text className={styles.label}>
                    {t("payment.cardExpiry", "Срок действия")}
                  </Text>
                  <Input
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Text className={styles.label}>
                    {t("payment.cardCVC", "CVC")}
                  </Text>
                  <Input
                    placeholder="000"
                    value={cardCVC}
                    onChange={(e) =>
                      setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    maxLength={3}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <Text className={styles.label}>
                  {t("payment.cardName", "Имя на карте")}
                </Text>
                <Input
                  placeholder="IVAN IVANOV"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className={styles.input}
                />
              </div>
            </>
          )}

          <Button
            type="primary"
            size="large"
            block
            className={styles.payButton}
            onClick={() => setIsOfferModalOpen(true)}
            loading={loading}
            disabled={
              !doctorData || !cardCVC || !cardExpiry || !cardNumber || !cardName
            }
          >
            {t("payment.payButton", {
              amount: doctorData?.price.toLocaleString("ru-RU") ?? "",
            })}
          </Button>
        </div>
      </Card>

      <SuccessModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>✓</div>
          <Title level={4} className={styles.successTitle}>
            {t("payment.successTitle")}
          </Title>
          <Text className={styles.successText}>
            {" "}
            {t("payment.successText")}
          </Text>
          <Button
            type="primary"
            size="large"
            block
            className={styles.telegramButton}
            onClick={handleGoToTelegramChat}
          >
            {t("chats.goToChat", "Перейти в чат")}
          </Button>
        </div>
      </SuccessModal>

      <Modal
        title={t("payment.offerTitle")}
        open={isOfferModalOpen}
        onOk={() => {
          if (!isOfferAccepted) return;
          setIsOfferModalOpen(false);
          handlePayment();
        }}
        onCancel={() => setIsOfferModalOpen(false)}
        okButtonProps={{ disabled: !isOfferAccepted, loading }}
        cancelButtonProps={{ disabled: loading }}
        centered
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Checkbox
            checked={isOfferAccepted}
            onChange={(e: any) => setIsOfferAccepted(e.target.checked)}
          >
            {t("payment.offerTextPrefix")}{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b82f6" }}
            >
              {t("payment.offerLink")}
            </a>{" "}
            {t("payment.offerTextSuffix")}
          </Checkbox>
          Мы поддерживаем работу с
          <img
            src="paymentSystem.png"
            style={{
              height: 24,
              objectFit: "contain",
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: 8,
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
