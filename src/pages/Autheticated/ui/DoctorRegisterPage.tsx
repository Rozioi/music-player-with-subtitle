import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Input, Select, Upload, Button, Checkbox, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import SelectCountry from "react-select";
import countryList from "react-select-country-list";
import "react-phone-input-2/lib/style.css";
import "antd/dist/reset.css";
import styles from "../styles/DoctorRegisterPage.module.scss";
import type { DoctorInput } from "../../../api/types";
import { useAuthReq } from "../../../hooks/useAuthReq";
import { useAppNavigation } from "../../../shared/hooks/useAppNavigation";
import { IoIosArrowBack } from "react-icons/io";

const { TextArea } = Input;

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const { goBack } = useAppNavigation();
  const options = countryList().getData();
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [doctorData, setDoctorData] = useState<DoctorInput>({
    specialization: "",
    qualification: "",
    experience: 0,
    description: "",
    education: "",
    certificates: [],
    consultationFee: 0,
    country: "",
  });

  const { createDoctor } = useAuthReq();

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    // Небольшая задержка для гарантии, что DOM полностью загружен
  }, []);

  const handleChange = (field: keyof DoctorInput, value: any) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setProfilePhoto(fileUrl);
    return false;
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      message.warning("Пожалуйста, примите условия использования");
      return;
    }

    if (!phoneNumber) {
      message.error("Пожалуйста, введите номер телефона");
      return;
    }

    if (!doctorData.qualification) {
      message.error("Пожалуйста, выберите категорию врача");
      return;
    }

    if (!doctorData.country) {
      message.error("Пожалуйста, выберите страну");
      return;
    }

    if (!doctorData.description || doctorData.description.trim().length < 10) {
      message.error(
        "Пожалуйста, добавьте информацию о себе (минимум 10 символов)",
      );
      return;
    }

    if (doctorData.experience < 0 || doctorData.experience > 50) {
      message.error("Стаж должен быть от 0 до 50 лет");
      return;
    }

    if (doctorData.consultationFee < 0) {
      message.error("Стоимость консультации не может быть отрицательной");
      return;
    }

    setIsSubmitting(true);

    try {
      const doctorResponse = await createDoctor(
        {
          ...doctorData,
          specialization: doctorData.specialization || doctorData.qualification,
        },
        phoneNumber,
      );

      if (!doctorResponse.success) {
        message.error(
          doctorResponse.error || "Ошибка при создании профиля врача",
        );
        setIsSubmitting(false);
        return;
      }

      message.success({
        content:
          "Регистрация успешно завершена! Перейдите на страницу входа и войдите в аккаунт.",
        duration: 5,
      });

      setTimeout(() => {
        navigate("/login");
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при регистрации. Попробуйте еще раз.";
      message.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer} ref={pageContainerRef}>
      <div className={styles.page}>
        <div onClick={goBack} className={styles.backButton}>
          <IoIosArrowBack />
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Регистрация врача</h1>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Номер телефона</label>
            <PhoneInput
              country={"kz"}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass={styles.phoneInput}
              containerClass={styles.phoneContainer}
              placeholder="+7 (000) 000-00-00"
              inputProps={{ required: true, disabled: isSubmitting }}
              enableSearch={true}
              specialLabel={""}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Какой у вас стаж (лет)?</label>
            <Input
              type="number"
              placeholder="Введите количество лет стажа"
              className={styles.input}
              min={0}
              max={50}
              value={doctorData.experience || ""}
              onChange={(e) =>
                handleChange("experience", parseInt(e.target.value) || 0)
              }
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Ваша специализация</label>
            <Select
              placeholder="Выберите специализацию"
              className={styles.select}
              onChange={(val) => {
                handleChange("specialization", val);
                handleChange("qualification", val);
              }}
              value={doctorData.specialization || undefined}
              options={[
                { value: "Терапевт", label: "Терапевт" },
                { value: "Педиатр", label: "Педиатр" },
                { value: "Хирург", label: "Хирург" },
                { value: "Стоматолог", label: "Стоматолог" },
                { value: "Кардиолог", label: "Кардиолог" },
                { value: "Гинеколог", label: "Гинеколог" },
                { value: "ЛОР", label: "ЛОР" },
                { value: "Невролог", label: "Невролог" },
                { value: "Офтальмолог", label: "Офтальмолог" },
                { value: "Психиатр", label: "Психиатр" },
                { value: "Дерматолог", label: "Дерматолог" },
              ]}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Категория врача</label>
            <Select
              placeholder="Выберите категорию"
              className={styles.select}
              onChange={(val) => handleChange("qualification", val)}
              value={doctorData.qualification || undefined}
              options={[
                {
                  value: "Врач первой категории",
                  label: "Врач первой категории",
                },
                {
                  value: "Врач второй категории",
                  label: "Врач второй категории",
                },
                {
                  value: "Врач высшей категории",
                  label: "Врач высшей категории",
                },
                {
                  value: "Кандидат медицинских наук",
                  label: "Кандидат медицинских наук",
                },
                {
                  value: "Доктор медицинских наук",
                  label: "Доктор медицинских наук",
                },
              ]}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Образование</label>
            <Input
              placeholder="Введите ваше образование"
              className={styles.input}
              value={doctorData.education}
              onChange={(e) => handleChange("education", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Добавьте информацию о себе</label>
            <TextArea
              placeholder="Это поможет вам привлекать больше пациентов и выстраивать доверительные отношения"
              rows={4}
              className={styles.textarea}
              value={doctorData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Стоимость консультации (₸)</label>
            <Input
              type="number"
              placeholder="Введите стоимость консультации"
              className={styles.input}
              min={0}
              value={doctorData.consultationFee || ""}
              onChange={(e) =>
                handleChange("consultationFee", parseFloat(e.target.value) || 0)
              }
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Добавьте фотографию профиля</label>
            <Upload
              beforeUpload={handlePhotoUpload}
              showUploadList={false}
              accept="image/*"
              disabled={isSubmitting}
            >
              <div className={styles.photoUploadBox}>
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="profile"
                    className={styles.photoPreview}
                  />
                ) : (
                  <CameraOutlined className={styles.cameraIcon} />
                )}
              </div>
            </Upload>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Выберите страну</label>
            <SelectCountry
              options={options}
              placeholder="Выберите страну"
              classNamePrefix="country-select"
              formatOptionLabel={(option) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={`https://flagcdn.com/24x18/${option.value.toLowerCase()}.png`}
                    alt={option.label}
                    style={{ width: 24, height: 18, borderRadius: 2 }}
                  />
                  <span>{option.label}</span>
                </div>
              )}
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: "#f6f8ff",
                  borderRadius: 12,
                  border: state.isFocused
                    ? "1px solid #8eb4ff"
                    : "1px solid #e0e6f6",
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(141, 181, 255, 0.3)"
                    : "none",
                  minHeight: 44,
                  padding: "2px 4px",
                  "&:hover": { borderColor: "#8eb4ff" },
                }),
                placeholder: (base: any) => ({
                  ...base,
                  color: "#b3b8c6",
                  fontSize: 14,
                }),
                menu: (base: any) => ({
                  ...base,
                  zIndex: 9999,
                  borderRadius: 12,
                }),
                singleValue: (base: any) => ({
                  ...base,
                  color: "#2f2f2f",
                  fontSize: 14,
                }),
              }}
              value={
                options.find((opt) => opt.value === doctorData.country) || null
              }
              onChange={(opt: any) => handleChange("country", opt?.value || "")}
              isDisabled={isSubmitting}
            />
          </div>

          <div className={styles.privacyWrapper}>
            <Checkbox
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

          <Button
            type="primary"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting || !acceptedTerms}
            loading={isSubmitting}
            block
          >
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
