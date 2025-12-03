import { Select } from "antd";
import styles from "./CustomSelect.module.scss";

interface ICustomSelectProps {
  options: { value: string; label: string }[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const CustomSelect = ({ options, defaultValue, value, onChange }: ICustomSelectProps) => {
  return (
    <Select
      options={options}
      className={styles["custom-select"]}
      defaultValue={defaultValue}
      value={value}
      variant="borderless"
      size="small"
      onChange={onChange}
    />
  );
};
