import logo from "../../shared/assets/images/logo.png";
import EUGer from "../../shared/assets/images/EUGer.png";
import styles from "./styles/Main.module.scss";
import { InfoBlock } from "./ui/InfoBlock";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";

const Main = () => {
  const { goTo } = useAppNavigation();

  return (
    <div className={styles.page}>
      <div className={styles["logo-container"]}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <div className={styles["blur-bg"]}></div>
      </div>

      <div className={styles["text-container"]}>
        <div className={styles["text-title"]}>
          <h1 className={styles.title}>Doctor chat</h1>
          <img className={styles.flag} src={EUGer} alt="EUGer" />
        </div>
        <p className={styles.description}>
          — мобильное приложение для онлайн-консультаций с квалифицированными
          врачами из Германии и Европы. Задавайте вопросы в чате и получайте
          рекомендации от специалистов.
        </p>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.primaryButton}
          onClick={() => goTo("/search")}
        >
          Поиск специалиста
        </button>
        <button
          className={styles.secondaryButton}
          onClick={() => goTo("/analyses")}
        >
          Расшифровки анализов
        </button>
      </div>
      <InfoBlock />
    </div>
  );
};

export default Main;
