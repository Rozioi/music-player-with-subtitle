import React from "react";
import { Typography } from "antd";
import ReactMarkdown from "react-markdown";
import { IoIosArrowBack } from "react-icons/io";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import styles from "./InfoPage.module.scss";

interface InfoPageProps {
  title: string;
  content: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, content }) => {
  const { goBack } = useAppNavigation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </button>
        <Typography.Title level={3} className={styles.title}>
          {title}
        </Typography.Title>
      </div>

      <div className={styles.content}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default InfoPage;
