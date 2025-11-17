import type { FC } from "react";
import { Card, Button } from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  StarFilled,
} from "@ant-design/icons";
import styles from "./styles/DoctorProfile.module.scss";
import WebApp from "@twa-dev/sdk";

interface DoctorProfileProps {
  name: string;
  specialty: string;
  experience: string;
  reviews: string;
  price: string;
  about: string;
  rating: number;
  image: string;
  doctorId?: string | number;
  onBack?: () => void;
  onStartChat?: () => void;
}

export const DoctorProfile: FC<DoctorProfileProps> = ({
  name,
  specialty,
  experience,
  reviews,
  price,
  about,
  rating,
  image,
  doctorId,
  onBack,
  onStartChat,
}) => {
  const shareProfile = () => {
    const shareText = `Врач: ${name}\nСпециальность: ${specialty}\nРейтинг: ${rating.toFixed(1)}\nОпыт: ${experience}\nСтоимость: ${price}`;
    const shareUrl = window.location.href;

    try {
      if (typeof WebApp !== "undefined" && WebApp.openLink) {
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        WebApp.openLink(telegramShareUrl);
      } else if (window.Telegram?.WebApp?.openLink) {
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.Telegram.WebApp.openLink(telegramShareUrl);
      } else {
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramShareUrl, "_blank");
      }
    } catch (error) {
      console.error("Ошибка при попытке поделиться через Telegram:", error);
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramShareUrl, "_blank");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
        <div className={styles.overlay}>
          <div className={styles.topBar}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className={styles.iconButton}
            />
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={shareProfile}
              className={styles.iconButton}
            />
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.specialty}>{specialty}</div>
            <div className={styles.name}>{name}</div>
            <div className={styles.rating}>
              <StarFilled className={styles.star} /> {rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.sectionTitle}>Основная информация</div>

        <div className={styles.infoRow}>
          <div className={styles.infoBox}>
            <div className={styles.value}>{experience}</div>
            <div className={styles.label}>стаж</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.value}>{reviews}</div>
            <div className={styles.label}>отзывов</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.value}>{price}</div>
            <div className={styles.label}>стоимость</div>
          </div>
        </div>

        <div className={styles.aboutSection}>
          <div className={styles.aboutTitle}>О враче</div>
          <p className={styles.aboutText}>{about}</p>
        </div>

        {onStartChat && (
          <Button
            type="primary"
            size="large"
            block
            className={styles.chatButton}
            onClick={onStartChat}
          >
            Начать чат
          </Button>
        )}
      </Card>
    </div>
  );
};
