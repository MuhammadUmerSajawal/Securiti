import { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import Header from "./Header";
import ChartCard from "./ChartCard";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [range, setRange] = useState("90");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleRangeChange = (value) => {
    setRange(value);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ ...styles.layout, ...(isMobile ? styles.layoutMobile : null) }}>
      <SideNavbar isMobile={isMobile} />

      <div style={styles.main}>
        <Header
          range={range}
          isMobile={isMobile}
          onRefresh={handleRefresh}
          onRangeChange={handleRangeChange}
        />

        <div style={{ ...styles.content, ...(isMobile ? styles.contentMobile : null) }}>
          <div style={{ ...styles.grid, ...(isMobile ? styles.gridMobile : null) }}>
            <ChartCard
              title="Users"
              refreshKey={refreshKey}
              range={range}
              chartType="pie"
              color="#2fa4f4"
            />
            <ChartCard
              title="Unique Logins"
              refreshKey={refreshKey}
              range={range}
              chartType="column"
              color="#2f9af0"
            />
            <ChartCard
              title="Queries Executed"
              refreshKey={refreshKey}
              range={range}
              chartType="area"
              color="#7ac24f"
            />
            <ChartCard
              title="Queries by Source"
              refreshKey={refreshKey}
              range={range}
              chartType="bar"
              color="#7ac24f"
            />
            <ChartCard
              title="Avg. Response Time"
              refreshKey={refreshKey}
              range={range}
              chartType="line"
              color="#7cb342"
            />
            <ChartCard
              title="Firewall API Calls"
              refreshKey={refreshKey}
              range={range}
              chartType="area"
              color="#46b0f5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc"
  },
  layoutMobile: {
    flexDirection: "column"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  content: {
    padding: "20px"
  },
  contentMobile: {
    padding: "12px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(320px, 1fr))",
    gap: "16px"
  },
  gridMobile: {
    gridTemplateColumns: "1fr",
    gap: "12px"
  }
};

export default App;
