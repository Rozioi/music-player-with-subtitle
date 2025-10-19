import React from "react";
import { Input } from "antd";
import styles from "./CustomInput.module.scss";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export const CustomInput = ({
  type = "text", // 'text' | 'password'
  placeholder = "",
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className={styles.wrapper}>
      {type === "password" ? (
        <Input.Password
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          {...rest}
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
      )}
    </div>
  );
};
