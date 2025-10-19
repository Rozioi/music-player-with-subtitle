import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./Slider.module.css";

type Slider = {
  title: string;
  points: string[];
  image: string;
};

interface ISliderProps {
  title: string;
  data: Slider[];
}

const Slider: React.FC<ISliderProps> = ({ title, data }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={40}
        slidesPerView={1}
        className={styles.slider}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.card}>
              <img src={item.image} alt="" className={styles.image} />
              <div className={styles.overlay}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <ul className={styles.points}>
                  {item.points.map((point, i) => (
                    <li key={i}> {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slider;
