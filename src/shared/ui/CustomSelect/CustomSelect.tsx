import { Select } from "antd";
import styles from "./CustomSelect.module.scss";

interface ICustomSelectProps {
  options: { value: string; label: string }[];
  defaultValue: string;
}

export const CustomSelect = ({ options, defaultValue }: ICustomSelectProps) => {
  return (
    <Select
      options={options}
      className={styles["custom-select"]}
      defaultValue={defaultValue}
      bordered={false}
      variant="borderless"
      size="small"
    />
  );
};
