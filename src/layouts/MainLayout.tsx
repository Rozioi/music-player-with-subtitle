import { Outlet } from "react-router";
import { NavBottomPanel } from "../shared/ui/NavBottomPanel/NavBottomPanel";
import styles from "../shared/assets/styles/MainLayout.module.scss";

export const MainLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.nav}>
        <NavBottomPanel />
      </div>
    </div>
  );
};
