import { useState } from "react";
import { Input, List, Button } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./styles/DoctorSearch.module.scss";
import { IoIosArrowBack } from "react-icons/io";
import { DoctorCard } from "../../shared/ui/DoctorCard/DoctorCard";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";

const doctorCategories = [
  "Гинеколог",
  "ЛОР",
  "Невролог",
  "Офтальмолог",
  "Педиатр",
  "Психиатр",
  "Терапевт",
  "Стоматолог",
  "Кардиолог",
  "Дерматолог",
];

// Примерные данные врачей
const doctors = [
  {
    id: "1",
    name: "Heinrich Konrad Steiner",
    country: "Германии",
    countryFlag: "🇩🇪",
    rating: 4.8,
    image: "https://i.pravatar.cc/150?img=12",
    category: "Терапевт",
  },
  {
    id: "2",
    name: "Katharina Luise Becker",
    country: "Франции",
    countryFlag: "🇫🇷",
    rating: 4.7,
    image: "https://i.pravatar.cc/150?img=47",
    category: "Терапевт",
  },
  {
    id: "3",
    name: "Elisabeth Maria Hoffmann",
    country: "Италии",
    countryFlag: "🇮🇹",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=32",
    category: "Кардиолог",
  },
];

const DoctorSearchPage: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { goBack } = useAppNavigation();

  const handleToggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const filteredCategories = doctorCategories.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase()),
  );
  const { goTo } = useAppNavigation();

  return (
    <div className={styles.container}>
      <div onClick={goBack} className={styles.backButton}>
        <IoIosArrowBack />
      </div>
      <h2 className={styles.title}>Поиск врача</h2>

      <Input.Search
        placeholder="Введите имя или категорию"
        allowClear
        className={styles.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <List
        dataSource={filteredCategories}
        renderItem={(item) => {
          const categoryDoctors = doctors.filter((d) => d.category === item);

          return (
            <div key={item} className={styles.categoryBlock}>
              <List.Item
                className={`${styles.item} ${openCategory === item ? styles.activeItem : ""}`}
                onClick={() => handleToggleCategory(item)}
              >
                <span>{item}</span>
                <Button
                  type="text"
                  shape="circle"
                  icon={
                    openCategory === item ? <DownOutlined /> : <RightOutlined />
                  }
                  className={styles.arrow}
                />
              </List.Item>

              {openCategory === item && (
                <div className={styles.doctorList}>
                  {categoryDoctors.length > 0 ? (
                    categoryDoctors.map((doctor) => (
                      <DoctorCard
                        onSelect={() => goTo("doctor/1")}
                        key={doctor.id}
                        {...doctor}
                      />
                    ))
                  ) : (
                    <div className={styles.empty}>
                      Нет врачей этой категории
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
        className={styles.list}
      />
    </div>
  );
};

export default DoctorSearchPage;
