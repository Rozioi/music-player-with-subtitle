import { NavLink, useLocation } from "react-router";
import styles from "./NavBottomPanel.module.scss";

import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
// import { PiChatCircleTextFill } from "react-icons/pi";
import { BsFillPersonFill } from "react-icons/bs";

export const NavBottomPanel = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const items = [
    { path: "/home", label: "Главная", icon: <GoHomeFill /> },
    { path: "/search", label: "Поиск", icon: <IoSearch /> },
    // { path: "/chat", label: "Чат", icon: <PiChatCircleTextFill /> },
    { path: "/profile", label: "Профиль", icon: <BsFillPersonFill /> },
  ];

  const isItemActive = (itemPath: string) => {
    if (itemPath === "/home") {
      // consider root and /home as home active
      return pathname === "/" || pathname === "/home";
    }

    if (itemPath === "/search") {
      // active for /search, nested /search/... (e.g. /search/doctor/:id) and /analyses
      return (
        pathname === "/search" ||
        pathname.startsWith("/search/") ||
        pathname === "/analyses"
      );
    }

    if (itemPath === "/profile") {
      // /profile and /profile/:slug
      return pathname === "/profile" || pathname.startsWith("/profile/");
    }

    // default: match exact or nested paths like /chat/...
    return pathname === itemPath || pathname.startsWith(itemPath + "/");
  };

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
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
