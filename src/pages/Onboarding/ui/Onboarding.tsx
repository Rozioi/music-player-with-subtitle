import logo from "../../../shared/assets/images/logo.png";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { CustomSelect } from "../../../shared/ui/CustomSelect/CustomSelect";
import { useEffect, useState } from "react";
import styles from "../styles/Onboarding.module.scss";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";

export const OnBoardingPage = () => {
  const { goTo } = useAppNavigation();
  const { isLogin } = useAuth();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<"ru" | "en">("ru");

  useEffect(() => {
    try {
      const savedLang = (localStorage.getItem("lang") as "ru" | "en" | null) || "ru";
      setLanguage(savedLang === "en" || savedLang === "ru" ? savedLang : "ru");
      i18n.changeLanguage(savedLang || "ru");
    } catch {
      // ignore storage errors
    }

    return () => {
      try {
        localStorage.setItem("onboardingSeen", "true");
      } catch {
        // ignore storage errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLogin) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={styles["page"]}>
      <div className={styles["logo-container"]}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <div className={styles["blur-bg"]}></div>
      </div>
      <div className={styles["text-container"]}>
        <h1 style={{ color: "white", fontSize: "1.9rem" }}>Doctor Chat</h1>
        <h1 className={styles.text}>{t("onboarding.title")}</h1>
        <p 
          className={styles["description"]}
          dangerouslySetInnerHTML={{
            __html: t("onboarding.description", {
              interpolation: { escapeValue: false },
            }).replace(/<bold>/g, '<strong style="font-weight: bold; color: #50d6ba;">').replace(/<\/bold>/g, '</strong>')
          }}
        />
      </div>
      <div className={styles.wrapper}>
        <CustomSelect
          value={language === "ru" ? "Русский" : "English"}
          options={[
            { value: "Русский", label: "Русский" },
            { value: "English", label: "English" },
          ]}
          onChange={(value) => {
            if (value === "Русский") {
              setLanguage("ru");
              try {
                localStorage.setItem("lang", "ru");
              } catch {
                // ignore
              }
              i18n.changeLanguage("ru");
            } else if (value === "English") {
              setLanguage("en");
              try {
                localStorage.setItem("lang", "en");
              } catch {
                // ignore
              }
              i18n.changeLanguage("en");
            }
          }}
        />
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => {
            goTo("/login");
          }}
          className={styles.login}
        >
          {t("onboarding.login")}
        </button>
        <div className={styles.registerGroup}>
          <button onClick={() => goTo("/register")} className={styles.register}>
            {t("onboarding.register")}
          </button>
          <a
            href="#"
            onClick={() => goTo("/doctor-registration")}
            className={styles.link}
          >
            {t("onboarding.iAmDoctor")}
          </a>
        </div>
      </div>
    </div>
  );
};
