import { NavLink, useLocation } from "react-router";
import styles from "./NavBottomPanel.module.scss";
import { useTranslation } from "react-i18next";

import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { PiChatCircleTextFill } from "react-icons/pi";
import { BsFillPersonFill } from "react-icons/bs";

// Предзагрузка компонентов при наведении
const preloadMain = () => import("../../../pages/Main/Main");
const preloadSearch = () => import("../../../pages/DoctorSearch/DoctorSearch");
const preloadChats = () => import("../../../pages/ChatList/ChatListPage");
const preloadProfile = () => import("../../../pages/PersonalAccount/PersonalAccountPage");

export const NavBottomPanel = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  const items = [
    { path: "/home", label: t("nav.home"), icon: <GoHomeFill /> },
    { path: "/search", label: t("nav.search"), icon: <IoSearch /> },
    { path: "/chat", label: t("nav.chats"), icon: <PiChatCircleTextFill /> },
    { path: "/profile", label: t("nav.profile"), icon: <BsFillPersonFill /> },
  ];

  const isItemActive = (itemPath: string) => {
    if (itemPath === "/home") {
      // consider root and /home as home active
      return pathname === "/" || pathname === "/home";
    }

    if (itemPath === "/search") {
      // active for /search, nested /search/... (e.g. /search/doctor/:id) and /analyses
      // но не для публичного роута /doctor/:slug
      return (
        (pathname === "/search" ||
        pathname.startsWith("/search/") ||
        pathname === "/analyses") &&
        !pathname.startsWith("/doctor/")
      );
    }

    if (itemPath === "/chat") {
      return pathname === "/chat" || pathname.startsWith("/chat/");
    }

    if (itemPath === "/profile") {
      // /profile and /profile/:slug
      return pathname === "/profile" || pathname.startsWith("/profile/");
    }

    // default: match exact or nested paths like /chat/...
    return pathname === itemPath || pathname.startsWith(itemPath + "/");
  };

  const handleMouseEnter = (path: string) => {
    // Предзагружаем компонент при наведении на ссылку
    if (path === "/home" || path === "/") {
      preloadMain();
    } else if (path === "/search") {
      preloadSearch();
    } else if (path === "/chat") {
      preloadChats();
    } else if (path === "/profile") {
      preloadProfile();
    }
  };

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onMouseEnter={() => handleMouseEnter(item.path)}
          onFocus={() => handleMouseEnter(item.path)}
          className={() => {
            const active = isItemActive(item.path);
            return `${styles.item} ${active ? styles.isActive : ""}`;
          }}
        >
          {item.icon}
        </NavLink>
      ))}
    </div>
  );
};
