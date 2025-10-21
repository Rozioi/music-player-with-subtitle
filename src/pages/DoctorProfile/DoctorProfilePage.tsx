import React from "react";
import { useParams } from "react-router";
import { DoctorProfile } from "./DoctorProfile";
import { useAppNavigation } from "../../shared/hooks/useAppNavigation";

// временные данные, в реальном коде — запрос по doctorId
const doctors = [
  {
    id: "1",
    name: "Friedrich Wilhelm Kraus",
    specialty: "Терапевт",
    experience: "3 года",
    reviews: "268",
    price: "3 200 ₸",
    rating: 5.0,
    image: "https://i.pravatar.cc/300?img=60",
    about:
      "Я — квалифицированный терапевт с 3-летним опытом работы. Специализируюсь на диагностике и лечении острых и хронических заболеваний, укреплении иммунитета и профилактике заболеваний.",
  },
];

export const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const doctor = doctors.find((d) => d.id === id);
  const { goBack } = useAppNavigation();

  if (!doctor) return <div>Врач не найден</div>;

  return <DoctorProfile {...doctor} onBack={goBack} />;
};
