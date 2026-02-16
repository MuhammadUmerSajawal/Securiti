import React, { useState } from "react";
import { LayoutDashboard, Users, BarChart3, Settings } from "lucide-react";

const Sidebar = ({ isMobile = false }) => {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { id: "dashboard", icon: LayoutDashboard },
    { id: "users", icon: Users },
    { id: "analytics", icon: BarChart3 },
    { id: "settings", icon: Settings }
  ];

  return (
    <div style={{ ...styles.sidebar, ...(isMobile ? styles.sidebarMobile : null) }}>
      <div style={{ ...styles.logo, ...(isMobile ? styles.logoMobile : null) }}>O</div>

      <div style={{ ...styles.menu, ...(isMobile ? styles.menuMobile : null) }}>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                ...styles.item,
                ...(isMobile ? styles.itemMobile : null),
                backgroundColor: isActive ? "#22c55e" : "transparent",
                color: isActive ? "#fff" : "#667085"
              }}
            >
              <Icon size={isMobile ? 18 : 20} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "64px",
    minHeight: "100vh",
    background: "#f6f7fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "16px",
    borderRight: "1px solid #e4e7ec"
  },
  sidebarMobile: {
    width: "100%",
    minHeight: "56px",
    paddingTop: 0,
    paddingInline: "12px",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRight: "none",
    borderBottom: "1px solid #e4e7ec"
  },
  logo: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#22c55e",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "32px",
    fontWeight: "bold"
  },
  logoMobile: {
    marginBottom: 0,
    width: "28px",
    height: "28px",
    borderRadius: "7px",
    fontSize: "12px"
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  menuMobile: {
    flexDirection: "row",
    gap: "8px"
  },
  item: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s"
  },
  itemMobile: {
    width: "34px",
    height: "34px",
    borderRadius: "8px"
  }
};

export default Sidebar;
