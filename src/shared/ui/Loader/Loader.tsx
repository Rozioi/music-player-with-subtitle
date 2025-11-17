import React from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  text,
  fullScreen = true,
}) => {
  const containerClass = fullScreen
    ? `${styles.container} ${styles.fullScreen}`
    : styles.container;

  return (
    <div className={containerClass}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
};
