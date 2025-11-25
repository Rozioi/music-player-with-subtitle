import { useState } from "react";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import { Checkbox, message } from "antd";
import styles from "../styles/AutheticatedPage.module.scss";
import { useRegistration } from "../../../features/auth/hooks/useRegistration";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { IoIosArrowBack } from "react-icons/io";
import "react-phone-input-2/lib/style.css";
import "antd/dist/reset.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { goTo, goBack } = useAppNavigation();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    phoneNumber,
    setPhoneNumber,
    isSubmitting,
    error,
    user,
    handleSubmit,
  } = useRegistration();

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = async () => {
    if (!acceptedTerms) {
      messageApi.error("Необходимо принять условия использования");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      messageApi.error("Пожалуйста, введите корректный номер телефона");
      return;
    }

    const success = await handleSubmit();
    if (success) {
      messageApi.success("Регистрация прошла успешно");
      navigate("/");
    } else {
      messageApi.error(error || "Ошибка при регистрации");
    }
  };

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.page}>
        <div onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Регистрация</h1>

          <div className={styles.inputWrapper}>
            <label>
              Номер телефона:
              <PhoneInput
                country={"kz"}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass={styles.phoneInput}
                containerClass={styles.phoneContainer}
                buttonClass={styles.flagDropdown}
                dropdownClass={styles.countryList}
                preferredCountries={["kz", "by", "ru", "ua"]}
                placeholder="+7 (000) 000-00-00"
                inputProps={{
                  name: "phone",
                  required: true,
                  disabled: isSubmitting,
                }}
                enableSearch={true}
                specialLabel={""}
              />
            </label>
          </div>

          <div className={styles.privacyWrapper}>
            <Checkbox
              className={styles.checkbox}
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              disabled={isSubmitting}
            />
            <p className={styles.privacyText}>
              Я принимаю{" "}
              <a href="#" className={styles.link}>
                политику конфиденциальности
              </a>{" "}
              и{" "}
              <a href="#" className={styles.link}>
                правила пользования
              </a>{" "}
              приложением
            </p>
          </div>

          <button
            className={styles.loginButton}
            onClick={handleRegister}
            disabled={isSubmitting || !acceptedTerms}
          >
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </button>
          <a href="#" onClick={() => goTo("/login")} className={styles.link}>
            войти
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
