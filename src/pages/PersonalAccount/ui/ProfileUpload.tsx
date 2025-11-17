import React, { useState, useEffect } from "react";
import { Upload, Avatar, message, Spin } from "antd";
import { MdAddAPhoto } from "react-icons/md";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { apiClient } from "../../../api/api";
import styles from "../styles/ProfileUpload.module.scss";

const ProfileUpload: React.FC = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.photoUrl) {
      setPhotoUrl(user.photoUrl);
    } else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setPhotoUrl(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }
  }, [user]);

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      message.error("Размер файла не должен превышать 5MB");
      return false;
    }

    if (!file.type.startsWith("image/")) {
      message.error("Пожалуйста, выберите изображение");
      return false;
    }

    if (!user?.telegramId) {
      message.error("Не удалось определить пользователя");
      return false;
    }

    setUploading(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPhotoUrl(previewUrl);

      const uploadResponse = await apiClient.uploadAvatar(file);

      if (!uploadResponse.success || !uploadResponse.data) {
        message.error(uploadResponse.error || "Ошибка при загрузке файла");
        if (user?.photoUrl) {
          setPhotoUrl(user.photoUrl);
        } else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
          setPhotoUrl(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
        } else {
          setPhotoUrl(null);
        }
        setUploading(false);
        return false;
      }

      const updateResponse = await apiClient.updateUserPhotoUrl(
        user.telegramId,
        uploadResponse.data.url,
      );

      if (updateResponse.success && updateResponse.data) {
        setPhotoUrl(uploadResponse.data.url);

        localStorage.setItem("user", JSON.stringify(updateResponse.data));

        message.success("Фотография успешно загружена");

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        message.error(updateResponse.error || "Ошибка при обновлении профиля");
        if (user?.photoUrl) {
          setPhotoUrl(user.photoUrl);
        } else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
          setPhotoUrl(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
        } else {
          setPhotoUrl(null);
        }
      }
    } catch (error) {
      message.error("Произошла ошибка при загрузке фотографии");
      if (user?.photoUrl) {
        setPhotoUrl(user.photoUrl);
      } else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
        setPhotoUrl(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
      } else {
        setPhotoUrl(null);
      }
    } finally {
      setUploading(false);
    }

    return false;
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Фотография профиля</p>
      <Upload
        name="avatar"
        listType="text"
        showUploadList={false}
        beforeUpload={handlePhotoUpload}
        accept="image/*"
        className={styles.uploadBox}
        disabled={uploading}
      >
        <div className={styles.avatarWrapper}>
          {uploading ? (
            <Spin size="large" />
          ) : photoUrl ? (
            <Avatar src={photoUrl} size={120} className={styles.avatar} />
          ) : (
            <div className={styles.iconWrapper}>
              <MdAddAPhoto className={styles.icon} />
            </div>
          )}
        </div>
      </Upload>
    </div>
  );
};

export default ProfileUpload;
