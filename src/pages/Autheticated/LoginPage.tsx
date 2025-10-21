import { useState, type ChangeEvent } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CustomInput } from "../../shared/ui/CustomInput/CustomInput";
import styles from "./styles/AutheticatedPage.module.scss";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Регистрация</h1>

      {/* Телефон */}
      <div className={styles.inputWrapper}>
        <label>
          Номер телефона:
          <PhoneInput
            country={"kz"}
            value={phone}
            onChange={setPhone}
            inputClass={styles.phoneInput}
            containerClass={styles.phoneContainer}
            buttonClass={styles.flagDropdown}
            preferredCountries={["kz", "by", "ru", "ua"]}
            placeholder="Введите номер телефона"
            inputProps={{
              name: "phone",
              required: true,
            }}
            enableSearch={true}
            specialLabel={""}
          />
        </label>
      </div>

      {/* Пароль */}
      <div className={styles.inputWrapper}>
        <label>
          Пароль:
          <CustomInput
            type="password"
            value={password}
            placeholder="Введите пароль"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </label>
        <a href="#" className={styles.forgotPassword}>
          Забыли пароль?
        </a>
      </div>

      {/* Кнопка */}
      <button className={styles.loginButton}>Войти</button>
    </div>
  );
};

export default LoginPage;
