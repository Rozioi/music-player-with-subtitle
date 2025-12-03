import { useTranslation } from "react-i18next";
import styles from "../styles/InfoBlock.module.scss";
import { InfoWarningBlock } from "./InfoWarningBlock";
import Slider from "./Slider";

export const InfoBlock = () => {
  const { t } = useTranslation();

  const SliderBlocks = [
    {
      title: t("info.advantages.title"),
      data: [
        {
          title: t("info.advantages.europeanStandards.title"),
          points: [
            t("info.advantages.europeanStandards.point1"),
            t("info.advantages.europeanStandards.point2"),
          ],
          image: "/images/advantages/1.png",
        },
        {
          title: t("info.advantages.speed.title"),
          points: [
            t("info.advantages.speed.point1"),
            t("info.advantages.speed.point2"),
          ],
          image: "/images/advantages/2.png",
        },
        {
          title: t("info.advantages.channels.title"),
          points: [t("info.advantages.channels.point1")],
          image: "/images/advantages/3.png",
        },
        {
          title: t("info.advantages.privacy.title"),
          points: [t("info.advantages.privacy.point1")],
          image: "/images/advantages/4.png",
        },
        {
          title: t("info.advantages.alternative.title"),
          points: [t("info.advantages.alternative.point1")],
          image: "/images/advantages/5.png",
        },
        {
          title: t("info.advantages.feedback.title"),
          points: [t("info.advantages.feedback.point1")],
          image: "/images/advantages/6.png",
        },
      ],
    },
    {
      title: t("info.problems.title"),

      data: [
        {
          title: t("info.problems.access.title"),
          points: [
            t("info.problems.access.point1"),
            t("info.problems.access.point2"),
          ],
          image: "/images/problems/1.png",
        },
        {
          title: t("info.problems.doubts.title"),
          points: [
            t("info.problems.doubts.point1"),
            t("info.problems.doubts.point2"),
          ],
          image: "/images/problems/2.png",
        },
        {
          title: t("info.problems.fear.title"),
          points: [t("info.problems.fear.point1")],
          image: "/images/problems/3.png",
        },
        {
          title: t("info.problems.time.title"),
          points: [
            t("info.problems.time.point1"),
            t("info.problems.time.point2"),
          ],
          image: "/images/problems/4.png",
        },
        {
          title: t("info.problems.visits.title"),
          points: [
            t("info.problems.visits.point1"),
            t("info.problems.visits.point2"),
          ],
          image: "/images/problems/5.png",
        },
        {
          title: t("info.problems.discomfort.title"),
          points: [
            t("info.problems.discomfort.point1"),
            t("info.problems.discomfort.point2"),
          ],
          image: "/images/problems/6.png",
        },
        {
          title: t("info.problems.psychological.title"),
          points: [t("info.problems.discomfort.point1")],
          image: "/images/problems/7.png",
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
