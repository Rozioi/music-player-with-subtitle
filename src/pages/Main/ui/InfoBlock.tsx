import styles from "../styles/InfoBlock.module.scss";
import { InfoWarningBlock } from "./InfoWarningBlock";
import Slider from "./Slider";

export const InfoBlock = () => {
  const SliderBlocks = [
    {
      title: "Преимущества обращения в Doctor Chat:",
      data: [
        {
          title: "Доступ к европейским стандартам медицины:",
          points: [
            "Консультации от квалифицированных врачей из стран Европы не покидая пределы вашей страны!",
            "Высокие стандарты качества обслуживания и медицинские рекомендации.",
          ],
          image: "src/shared/assets/images/advantages/1.png",
        },
        {
          title: "Быстрота и удобство:",
          points: [
            "Возможность получить консультацию не выходя из дома.",
            "Оперативный ответ — от минуты до часа. Формат онлайн «живая очередь».",
          ],
          image: "src/shared/assets/images/advantages/2.png",
        },
        {
          title: "Разнообразие каналов общения:",
          points: [
            "Возможность использовать текст, фото, аудио и видео форматы для общения с врачом.",
          ],
          image: "src/shared/assets/images/advantages/3.png",
        },
        {
          title: "Конфиденциальность и безопасность:",
          points: ["Гарантирована полная анонимность и защита ваших данных."],
          image: "src/shared/assets/images/advantages/4.png",
        },
        {
          title: "Безопасная альтернатива самодиагностике:",
          points: [
            "Получение профессионального совета вместо вредной «самолечения» с помощью интернета.",
          ],
          image: "src/shared/assets/images/advantages/5.png",
        },
        {
          title: "Обратная связь и улучшение сервиса:",
          points: [
            "Возможность оставить отзыв и повлиять на улучшение сервиса.",
          ],
          image: "src/shared/assets/images/advantages/6.png",
        },
      ],
    },
    {
      title: "Современные Проблемы Пациентов:",
      data: [
        {
          title: "Отсутствие доступа к качественным медицинским услугам:",
          points: [
            "Трудности в поиске квалифицированных специалистов в своем регионе",
            "Долгое ожидание очереди на прием к врачу.",
          ],
          image: "src/shared/assets/images/problems/1.png",
        },
        {
          title: "Сомнения и потребность в дополнительной информации:",
          points: [
            "Неопределенность после предыдущего диагноза или лечения.",
            "Необходимость услышать второе мнение.",
          ],
          image: "src/shared/assets/images/problems/2.png",
        },
        {
          title: "Страх и неуверенность в здоровье:",
          points: [
            "Непонимание результатов анализов и желательность консультации без стресса и спешки.",
          ],
          image: "src/shared/assets/images/problems/3.png",
        },
        {
          title: "Время и логистические ограничения:",
          points: [
            "	Нехватка времени на посещение врача в офисе или больнице.",
            "Находясь за границей, возникают сложности с доступом к местным медицинским услугам.",
          ],
          image: "src/shared/assets/images/problems/4.png",
        },
        {
          title: "Желание избежать ненужных визитов:",
          points: [
            "	Потребность только в информационной поддержке.",
            "Предпочтение получить консультацию быстро и без формальностей.",
          ],
          image: "src/shared/assets/images/problems/5.png",
        },
        {
          title: "Дискомфорт и стеснение:",
          points: [
            "Неудобство или стеснительность при обсуждении личных вопросов здоровья лицом к лицу.",
            "Предпочтение конфиденциальности и анонимности при взаимодействии с врачом",
          ],
          image: "src/shared/assets/images/problems/6.png",
        },
        {
          title: "Психологический комфорт:",
          points: [
            "Стресс и тревожность, вызванные ожиданием визита к врачу или неприятными визитами в медицинские учреждения.",
          ],
          image: "src/shared/assets/images/problems/7.png",
        },
      ],
    },
  ];
  return (
    <div className={styles.container}>
      {SliderBlocks.map((block, i) => (
        <Slider key={i} title={block.title} data={block.data} />
      ))}

      <InfoWarningBlock />
    </div>
  );
};
