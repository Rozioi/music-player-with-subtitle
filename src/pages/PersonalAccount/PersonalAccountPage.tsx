import React, { useState } from "react";
import { Input, Button, Card, Typography } from "antd";

import styles from "./styles/PersonalAccountPage.module.scss";
import ProfileUpload from "./ui/ProfileUpload";
import InfoLinks from "./ui/InfoLinks";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";
const { Title, Text } = Typography;

const PersonalAccountPage: React.FC = () => {
  const [balance] = useState(14000);
  const [name, setName] = useState("Артём Савельев");
  const [phone, setPhone] = useState("+7 (000) 000-00-00");
  const [card] = useState("Visa **** 9399");
  const { goBack } = useAppNavigation();

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
            onChange={(e) => setName(e.target.value)}
            suffix={<Button type="link">Изменить</Button>}
          />
        </div>

        <div className={styles.field}>
          <Text className={styles.label}>Номер телефона</Text>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        {/*<div className={styles.field}>
          <Text className={styles.label}>Добавьте фотографию профиля</Text>
          <Upload>
            <Button icon={<UploadOutlined />}>Загрузить</Button>
          </Upload>
        </div>*/}
        <ProfileUpload />
        <Button type="primary" block className={styles.saveBtn}>
          Сохранить
        </Button>
        <InfoLinks />
        {/*<div className={styles.links}>
          <Button type="link">Условия возврата</Button>
          <Button type="link">Как происходит оплата</Button>
          <Button type="link">Обратная связь</Button>
        </div>*/}
      </Card>
    </div>
  );
};

export default PersonalAccountPage;
