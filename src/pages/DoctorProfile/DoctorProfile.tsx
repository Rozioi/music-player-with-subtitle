import type { FC } from "react";
import { Card, Button } from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  StarFilled,
} from "@ant-design/icons";
import styles from "./styles/DoctorProfile.module.scss";

interface DoctorProfileProps {
  name: string;
  specialty: string;
  experience: string;
  reviews: string;
  price: string;
  about: string;
  rating: number;
  image: string;
  onBack?: () => void;
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
  onBack,
}) => {
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

        <Button type="primary" className={styles.chatButton}>
          Начать чат
        </Button>
      </Card>
    </div>
  );
};
