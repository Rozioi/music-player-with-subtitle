import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CustomInput } from "../../../shared/ui/CustomInput/CustomInput";
import styles from "../styles/AutheticatedPage.module.scss";
import "antd/dist/reset.css";
const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Вход</h1>

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
            dropdownClass={styles.countryList}
            preferredCountries={["kz", "by", "ru", "ua"]}
            placeholder="+7 (000) 000-00-00"
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
          Введите пароль:
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

      <button className={styles.loginButton} onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
};

export default LoginPage;
