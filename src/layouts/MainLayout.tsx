import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { NavBottomPanel } from "../shared/ui/NavBottomPanel/NavBottomPanel";
import styles from "../shared/assets/styles/MainLayout.module.scss";
import { OnBoardingPage } from "../pages/Onboarding/ui/Onboarding";

export const MainLayout = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem("onboardingSeen");
    } catch {
      // If localStorage is not available for any reason, do not block app
      return false;
    }
  });

  // When user navigates away from the onboarding page, mark onboarding as seen.
  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;

    if (prev === "/onboarding" && curr !== "/onboarding") {
      try {
        localStorage.setItem("onboardingSeen", "true");
      } catch {
        // ignore
      }
      setShowOnboarding(false);
    }

    prevPathRef.current = curr;
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {showOnboarding ? <Outlet /> : <Outlet />}
      </div>
      {showOnboarding ? (
        <div className={styles.nav}>
          <NavBottomPanel />
        </div>
      ) : (
        <div className={styles.nav}>
          <NavBottomPanel />
        </div>
      )}
    </div>
  );
};
