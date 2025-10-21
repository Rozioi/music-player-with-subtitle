import React from "react";
import styles from "../styles/InfoLinks.module.scss";
import { MdArrowForwardIos } from "react-icons/md";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";

const InfoLinks: React.FC = () => {
  const links = [
    { label: "Условия возврата", icon: <MdArrowForwardIos />, link: "refund" },
    {
      label: "Как происходит оплата",
      icon: <MdArrowForwardIos />,
      link: "payment",
    },
    {
      label: "Обратная связь",
      icon: <MdArrowForwardIos />,
      link: "connection",
    },
  ];
  const { goTo } = useAppNavigation();
  return (
    <div className={styles.linksWrapper}>
      {links.map((item, index) => (
        <button
          key={index}
          onClick={() => goTo(item.link)}
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
