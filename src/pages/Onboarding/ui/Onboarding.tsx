import logo from "../../../shared/assets/images/logo.png";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { CustomSelect } from "../../../shared/ui/CustomSelect/CustomSelect";

import styles from "../styles/Onboarding.module.scss";

export const OnBoardingPage = () => {
  const { goTo } = useAppNavigation();
  return (
    <div className={styles["page"]}>
      <div className={styles["logo-container"]}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <div className={styles["blur-bg"]}></div>
      </div>
      <div className={styles["text-container"]}>
        <h1 style={{ color: "white", fontSize: "1.9rem" }}>Doctor Chat</h1>
        <h1 className={styles.text}>Ваш врач на связи</h1>
        <p className={styles["description"]}>
          Быстрая и удобная связь с врачами из {""}
          <b style={{ color: "white" }}>Европы</b> в любое время.
        </p>
      </div>
      <div className={styles.wrapper}>
        <CustomSelect
          defaultValue="Русский"
          options={[
            { value: "Русский", label: "Русский" },
            { value: "English", label: "English" },
          ]}
        />
      </div>
      <div className={styles.buttons}>
        <button onClick={() => goTo("/login")} className={styles.login}>
          Войти
        </button>
        <div className={styles.registerGroup}>
          <button onClick={() => goTo("/register")} className={styles.register}>
            Регистрация
          </button>
          <a href="#" className={styles.link}>
            Я врач
          </a>
        </div>
      </div>
    </div>
  );
};
