import React from "react";
import { Upload } from "antd";
import { MdAddAPhoto } from "react-icons/md";
import styles from "../styles/ProfileUpload.module.scss";

const ProfileUpload: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Добавьте фотографию профиля</p>
      <Upload
        name="avatar"
        listType="text" // 👈 используем "text", чтобы убрать фон antd
        showUploadList={false}
        className={styles.uploadBox}
      >
        <div className={styles.iconWrapper}>
          <MdAddAPhoto className={styles.icon} />
        </div>
      </Upload>
    </div>
  );
};

export default ProfileUpload;
