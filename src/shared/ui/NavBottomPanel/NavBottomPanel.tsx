import { NavLink } from "react-router";
import styles from "./NavBottomPanel.module.scss";

import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { PiChatCircleTextFill } from "react-icons/pi";
import { BsFillPersonFill } from "react-icons/bs";

export const NavBottomPanel = () => {
  const items = [
    { path: "/home", label: "Главная", icon: <GoHomeFill /> },
    { path: "/search", label: "Поиск", icon: <IoSearch /> },
    { path: "/chat", label: "Чат", icon: <PiChatCircleTextFill /> },
    { path: "/profile", label: "Профиль", icon: <BsFillPersonFill /> },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path === "/search" ? "/search" : item.path}
          className={({ isActive }) => {
            const active =
              item.path === "/search"
                ? window.location.pathname === "/search" ||
                  window.location.pathname === "/analyses"
                : isActive;

            return `${styles.item} ${active ? styles.isActive : ""}`;
          }}
        >
          {item.icon}
        </NavLink>
      ))}
    </div>
  );
};
