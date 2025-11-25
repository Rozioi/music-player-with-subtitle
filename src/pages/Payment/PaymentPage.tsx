import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Input, Button, Card, Typography, message, Radio } from "antd";
import { CreditCardOutlined, WalletOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { apiClient } from "../../api/api";
import { SuccessModal } from "../../shared/ui/Modal/Modal";
import WebApp from "@twa-dev/sdk";
import styles from "./styles/PaymentPage.module.scss";
import { PaymentIcons } from "../../shared/ui/PaymentIcons/PaymentIcons";

const { Title, Text } = Typography;

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { goBack } = useAppNavigation();
  const { user } = useAuth();
  const doctorIdParam = searchParams.get("doctorId");
  const serviceType = searchParams.get("serviceType") || "consultation";

  const [paymentMethod, setPaymentMethod] = useState<"balance" | "card">(
    "balance",
  );
  const [balance, setBalance] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorData, setDoctorData] = useState<{
    name: string;
    price: number;
  } | null>(null);

  // Загрузка данных
  useEffect(() => {
    if (doctorIdParam) loadDoctorData();
    loadBalance();
  }, [doctorIdParam, user]);

  const loadBalance = async () => {
    try {
      setLoadingBalance(true);
      const telegramId =
        user?.telegramId ||
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
      if (!telegramId) return;

      const response = await apiClient.getBalance(telegramId);
      if (response.success && response.data) {
        setBalance(response.data.amount);
      }
    } catch (err) {
      console.error("Failed to load balance:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

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

  // Форматирование полей
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

  // Обработка платежа
  const handlePayment = async () => {
    if (!doctorIdParam || !doctorData) {
      messageApi.error("Данные для оплаты неполные");
      return;
    }

    const validDoctorId = String(doctorIdParam).trim();
    if (!validDoctorId || isNaN(Number(validDoctorId))) {
      messageApi.error("Неверный ID врача");
      return;
    }

    const amount = doctorData.price;

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
        messageApi.error("Заполните все поля карты");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        messageApi.error("Номер карты должен содержать 16 цифр");
        return;
      }
    } else if (paymentMethod === "balance" && balance < amount) {
      messageApi.error("Недостаточно средств на балансе");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const telegramId =
        user?.telegramId ||
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
      if (!telegramId) {
        messageApi.error("Не удалось определить пользователя");
        setLoading(false);
        return;
      }

      const chatResponse = await apiClient.createChat({
        doctorId: Number(validDoctorId),
        serviceType: serviceType === "analysis" ? "analysis" : "consultation",
        amount,
        telegramId,
      });

      if (chatResponse.success) {
        await apiClient.sendChatInvite(telegramId, Number(validDoctorId));
        setIsModalOpen(true);
      } else {
        messageApi.error(chatResponse.error || "Ошибка при создании чата");
      }
    } catch (err) {
      messageApi.error("Ошибка при обработке платежа");
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
    serviceType === "analysis" ? "Расшифровка анализов" : "Консультация";

  return (
    <div className={styles.container}>
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      {contextHolder}
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          Оплата услуги
        </Title>

        {doctorData && (
          <div className={styles.serviceInfo}>
            <Text className={styles.serviceName}>{getServiceName()}</Text>
            <Text className={styles.doctorName}>Врач: {doctorData.name}</Text>
            <Text className={styles.price}>
              {doctorData.price.toLocaleString("ru-RU")} ₸
            </Text>
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <Text className={styles.label}>Способ оплаты</Text>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.paymentMethodGroup}
            >
              <Radio value="balance" className={styles.paymentRadio}>
                <WalletOutlined /> С баланса ({balance.toLocaleString("ru-RU")}{" "}
                ₸)
              </Radio>
              <Radio value="card" className={styles.paymentRadio}>
                <CreditCardOutlined /> Банковской картой
              </Radio>
            </Radio.Group>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className={styles.inputGroup}>
                <Text className={styles.label}>Номер карты</Text>
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
                  <Text className={styles.label}>Срок действия</Text>
                  <Input
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Text className={styles.label}>CVC</Text>
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
                <Text className={styles.label}>Имя на карте</Text>
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
            onClick={handlePayment}
            loading={loading}
            disabled={
              paymentMethod === "card" &&
              (!cardNumber || !cardExpiry || !cardCVC || !cardName)
            }
          >
            Оплатить {doctorData?.price.toLocaleString("ru-RU")} ₸
          </Button>
        </div>
      </Card>

      <SuccessModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>✓</div>
          <Title level={4} className={styles.successTitle}>
            Оплата прошла успешно!
          </Title>
          <Text className={styles.successText}>
            Оплата прошла успешно! Проверьте Telegram - вам отправлено сообщение
            с кнопкой для перехода в чат с врачом.
          </Text>
          <Button
            type="primary"
            size="large"
            block
            className={styles.telegramButton}
            onClick={handleGoToTelegramChat}
          >
            Перейти в чат
          </Button>
        </div>
      </SuccessModal>
    </div>
  );
};

export default PaymentPage;
