import { Suspense } from "react";
import { Outlet } from "react-router";
import styles from "../shared/assets/styles/MainLayout.module.scss";
import { Loader } from "../shared/ui/Loader/Loader";

export const PublicLayout = () => {
  return (
    <Suspense fallback={<Loader fullScreen text="Загрузка..." size="medium" />}>
      <div className={styles.container}>
        <div className={styles.content} style={{ paddingBottom: 0 }}>
          <Outlet />
        </div>
      </div>
    </Suspense>
  );
};
