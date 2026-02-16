import React from "react";
import { RefreshCcw } from "lucide-react";

const Header = ({ range, isMobile, onRefresh, onRangeChange }) => {
  return (
    <div style={{ ...styles.container, ...(isMobile ? styles.containerMobile : null) }}>
      <div>
        <h2 style={styles.title}>Analytics</h2>

        <div style={{ ...styles.filterRow, ...(isMobile ? styles.filterRowMobile : null) }}>
          <span style={styles.label}>Time Range</span>
          <select value={range} onChange={(e) => onRangeChange(e.target.value)} style={styles.select}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <button style={{ ...styles.button, ...(isMobile ? styles.buttonMobile : null) }} onClick={onRefresh}>
        <RefreshCcw size={16} style={{ marginRight: 6 }} />
        Refresh Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e4e7ec",
    background: "#fff"
  },
  containerMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "12px",
    padding: "14px 12px"
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#101828"
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    marginTop: "6px",
    gap: "8px"
  },
  filterRowMobile: {
    flexWrap: "wrap",
    rowGap: "6px"
  },
  label: {
    fontSize: "13px",
    color: "#667085"
  },
  select: {
    border: "1px solid #d0d5dd",
    borderRadius: "6px",
    padding: "6px 8px",
    fontSize: "13px",
    background: "#f9fafb"
  },
  button: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d0d5dd",
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
    justifyContent: "center"
  },
  buttonMobile: {
    width: "100%"
  }
};

export default Header;
