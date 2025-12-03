import React from "react";
import styles from "../styles/InfoLinks.module.scss";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router";

const InfoLinks: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    {
      label: "Как происходит получение товара",
      icon: <MdArrowForwardIos />,
      link: "delivery",
    },
    {
      label: "Как происходит оплата",
      icon: <MdArrowForwardIos />,
      link: "paymentProc",
    },
    { label: "Обратная связь", icon: <MdArrowForwardIos />, link: "contacts" },
  ];

  return (
    <div className={styles.linksWrapper}>
      {links.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(`/${item.link}`)} // переход на /:slug
          className={styles.linkButton}
        >
          <span className={styles.text}>{item.label}</span>
          <span className={styles.iconWrapper}>{item.icon}</span>
        </button>
      ))}
    </div>
  );
};
export default InfoLinks;
