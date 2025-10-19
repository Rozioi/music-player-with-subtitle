import styles from "../styles/InfoWarningBlock.module.scss";

export const InfoWarningBlock = () => {
  return (
    <div className={styles.infoBlock}>
      <div className={styles.title}>Важно!</div>
      <div className={styles.text}>
        Законодательство РК не предусматривает назначение рецептурных лекарств,
        назначение курса лечения и постановки диагноза во время
        онлайн-консультации. Для этого необходимо записаться на очный приём.
      </div>
      <div className={styles.text}>
        Консультация является информационной, а не медицинской.
      </div>
      <div className={styles.emergency}>
        В случае неотложных состояний необходимо вызвать скорую помощь по номеру
        112!
      </div>
    </div>
  );
};
