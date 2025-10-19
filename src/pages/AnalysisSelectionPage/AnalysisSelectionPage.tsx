import React, { useState } from "react";
import { Switch, Button, Typography, Space, ConfigProvider } from "antd";
import { DoctorCard } from "../../shared/ui/DoctorCard/DoctorCard";
import styles from "./styles/AnalysisSelectionPage.module.scss";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
import { SuccessModal } from "../../shared/ui/Modal/Modal";
import { FaCheck } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";

const { Title, Text } = Typography;

const AnalysisSelectionPage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([
    "blood",
    "urine",
    "stool",
  ]);
  const [isSuccessful, setIsSuccessful] = useState(true);
  const handlePay = () => {
    console.log("Выбран врач:", selectedDoctor);
    console.log("Выбранные анализы:", selectedAnalyses);
    setIsSuccessful(!isSuccessful);
    setIsModalOpen(true);
  };

  const analyses = [
    { label: "Общий анализ крови", key: "blood" },
    { label: "Биохимия крови", key: "bio" },
    { label: "Общий анализ мочи", key: "urine" },
    { label: "Копрограмма (общий анализ кала)", key: "stool" },
  ];

  const doctors = [
    {
      id: "1",
      name: "Heinrich Konrad Steiner",
      country: "Германии",
      countryFlag: "🇩🇪",
      rating: 4.8,
      image: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: "2",
      name: "Katharina Luise Becker",
      country: "Франции",
      countryFlag: "🇫🇷",
      rating: 4.7,
      image: "https://i.pravatar.cc/150?img=47",
    },
  ];

  const toggleAnalysis = (key: string, checked: boolean) => {
    setSelectedAnalyses((prev) =>
      checked ? [...prev, key] : prev.filter((a) => a !== key),
    );
  };

  const { goBack } = useAppNavigation();

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
          Выберите анализ и получите расшифровку онлайн:
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

        <Title level={5} className={styles.subtitle}>
          Выберите врача:
        </Title>

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

        <Button
          type="primary"
          size="large"
          className={styles.payButton}
          block
          disabled={!selectedDoctor || selectedAnalyses.length === 0}
          onClick={handlePay} // Добавлен обработчик
        >
          Оплатить
        </Button>
      </div>

      <SuccessModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          className={`${styles.successIcon} ${isSuccessful ? styles.success : styles.error}`}
        >
          {isSuccessful ? <FaCheck /> : <FaExclamation />}
        </div>
        <h3 className={styles.title}>
          {" "}
          {isSuccessful
            ? "Оплата прошла успешно!"
            : "Недостаточно средств для оплаты услуги"}
        </h3>
        <p className={styles.description}>
          {isSuccessful
            ? "Пожалуйста прикрепите ваш результат анализов чате с врачом ниже."
            : "Пополните баланс и попробуйте снова."}
        </p>

        <Button size="large" className={styles.attachButton}>
          {isSuccessful ? "Перейти в чат" : "Попробовать ещё"}
        </Button>
      </SuccessModal>
    </ConfigProvider>
  );
};

export default AnalysisSelectionPage;
