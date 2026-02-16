import React, { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SOURCE_NAMES = ["Slack", "Microsoft Teams", "AWS Cloud", "Google Cloud", "G Suite Gmail"];
const CATEGORY_MULTIPLIERS = {
  all: 1,
  security: 0.9,
  productivity: 1.1,
  infra: 1.25
};

const generateDateLabels = (range) => {
  const today = new Date();
  const labels = [];

  for (let i = range - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    );
  }

  return labels;
};

const formatCompact = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return `${Math.round(value)}`;
};

const buildSeriesData = (title, range, chartType, refreshSeed, category) => {
  const lowerTitle = title.toLowerCase();
  const scale = CATEGORY_MULTIPLIERS[category] ?? 1;
  const random = (min, max) =>
    Math.round((min + Math.floor(((Math.random() + refreshSeed * 0.0001) % 1) * (max - min))) * scale);

  if (chartType === "pie") {
    const total = random(420, 700);
    const active = Math.round(total * 0.86);
    const inactive = Math.max(0, total - active);

    return [
      { name: "Active", y: active, color: "#2fa4f4" },
      { name: "Inactive", y: inactive, color: "#d0d5dd" }
    ];
  }

  if (chartType === "bar") {
    return SOURCE_NAMES.map(() => random(20, 200));
  }

  if (lowerTitle.includes("response")) {
    return Array.from({ length: range }, () => Number((1.6 + Math.random() * 1.8).toFixed(2)));
  }

  if (lowerTitle.includes("quer")) {
    return Array.from({ length: range }, () => random(140, 560));
  }

  if (lowerTitle.includes("user") || lowerTitle.includes("login")) {
    return Array.from({ length: range }, () => random(10, 65));
  }

  return Array.from({ length: range }, () => random(30, 100));
};

const buildSummary = (title, data, chartType) => {
  const lowerTitle = title.toLowerCase();

  if (chartType === "pie") {
    const totalUsers = data.reduce((sum, item) => sum + item.y, 0);
    const active = data.find((item) => item.name === "Active")?.y ?? 0;
    const inactive = data.find((item) => item.name === "Inactive")?.y ?? 0;

    return {
      list: [
        { label: "Total Users", value: totalUsers },
        { label: "Active", value: active },
        { label: "Inactive", value: inactive }
      ]
    };
  }

  if (chartType === "bar") {
    const total = data.reduce((sum, item) => sum + item, 0);
    return {
      label: "Queries by Source",
      value: formatCompact(total)
    };
  }

  if (lowerTitle.includes("user")) {
    const totalUsers = Math.max(120, Math.round(data.reduce((sum, item) => sum + item, 0) * 0.42));
    const active = Math.round(totalUsers * 0.92);
    const inactive = totalUsers - active;

    return {
      list: [
        { label: "Total Users", value: totalUsers },
        { label: "Active", value: active },
        { label: "Inactive", value: inactive }
      ]
    };
  }

  if (lowerTitle.includes("login")) {
    const totalLogins = Math.round(data.reduce((sum, item) => sum + item, 0) * 0.11);

    return {
      label: "Number of Unique Logins",
      value: formatCompact(totalLogins)
    };
  }

  if (lowerTitle.includes("quer")) {
    return {
      label: "Queries Executed in Workflow",
      value: formatCompact(data.reduce((sum, item) => sum + item, 0))
    };
  }

  if (lowerTitle.includes("response")) {
    const avg = data.reduce((sum, item) => sum + item, 0) / Math.max(1, data.length);

    return {
      label: "Avg. Response Time",
      value: `${avg.toFixed(2)}s`
    };
  }

  return {
    label: title,
    value: formatCompact(data.reduce((sum, item) => sum + item, 0))
  };
};

const lowerCaseIncludesSeconds = (title) => title.toLowerCase().includes("response");

const simulateAsyncFetch = (title, normalizedRange, chartType, refreshSeed, category) =>
  new Promise((resolve, reject) => {
    const delay = 350 + Math.round(Math.random() * 450);

    setTimeout(() => {
      const shouldFail = Math.random() < 0.08;
      if (shouldFail) {
        reject(new Error("Failed to load chart data"));
        return;
      }

      resolve(buildSeriesData(title, normalizedRange, chartType, refreshSeed, category));
    }, delay);
  });

const ChartCard = ({
  title,
  refreshKey,
  range,
  category = "all",
  chartType = "line",
  color = "#2fa4f4"
}) => {
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const normalizedRange = Number(range) || 30;
  const refreshSeed = refreshKey + localRefreshKey;

  useEffect(() => {
    let active = true;

    const fetchChartData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await simulateAsyncFetch(
          title,
          normalizedRange,
          chartType,
          refreshSeed,
          category
        );

        if (!active) return;
        setData(response);
      } catch (fetchError) {
        if (!active) return;
        setError(fetchError.message || "Something went wrong");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchChartData();

    return () => {
      active = false;
    };
  }, [category, chartType, normalizedRange, refreshSeed, title]);

  const summary = useMemo(() => buildSummary(title, data, chartType), [title, data, chartType]);

  const chartOptions = useMemo(() => {
    const isBar = chartType === "bar";
    const isArea = chartType === "area";
    const isPie = chartType === "pie";
    const categories = isBar ? SOURCE_NAMES : generateDateLabels(normalizedRange);

    return {
      chart: {
        type: chartType,
        backgroundColor: "transparent",
        height: 180,
        spacing: [6, 4, 2, 4]
      },
      title: { text: "" },
      xAxis: {
        visible: !isPie,
        categories,
        tickLength: 0,
        lineColor: "#edf1f7",
        labels: {
          style: {
            color: "#98a2b3",
            fontSize: "11px"
          }
        }
      },
      yAxis: {
        visible: !isPie,
        title: { text: "" },
        gridLineColor: "#f2f4f7",
        labels: {
          style: {
            color: "#98a2b3",
            fontSize: "11px"
          }
        }
      },
      plotOptions: {
        series: {
          animation: false,
          marker: {
            enabled: false
          }
        },
        column: {
          pointPadding: 0.08,
          groupPadding: 0.07,
          borderWidth: 0,
          borderRadius: 2
        },
        bar: {
          borderWidth: 0,
          borderRadius: 2,
          pointPadding: 0.2
        },
        area: {
          lineWidth: 1.8,
          fillOpacity: 0.18
        },
        line: {
          lineWidth: 1.8
        },
        pie: {
          borderWidth: 0,
          size: "86%",
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [
        {
          name: title,
          data,
          color,
          showInLegend: false,
          fillColor: isArea
            ? {
                linearGradient: [0, 0, 0, 180],
                stops: [
                  [0, Highcharts.color(color).setOpacity(0.28).get("rgba")],
                  [1, Highcharts.color(color).setOpacity(0.03).get("rgba")]
                ]
              }
            : undefined
        }
      ],
      tooltip: {
        pointFormat: isPie ? "<b>{point.percentage:.1f}%</b> ({point.y})" : undefined,
        valueDecimals: lowerCaseIncludesSeconds(title) ? 2 : 0,
        backgroundColor: "#ffffff",
        borderColor: "#d0d5dd",
        borderRadius: 6,
        shadow: false
      },
      legend: isPie
        ? {
            enabled: true,
            align: "right",
            verticalAlign: "middle",
            layout: "vertical",
            itemStyle: {
              color: "#475467",
              fontSize: "12px",
              fontWeight: 500
            }
          }
        : { enabled: false },
      credits: { enabled: false }
    };
  }, [chartType, color, data, normalizedRange, title]);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <RefreshCcw
          size={14}
          onClick={() => setLocalRefreshKey((prev) => prev + 1)}
          style={styles.refreshIcon}
        />
      </div>

      {summary.list ? (
        <div style={styles.metricList}>
          {summary.list.map((item) => (
            <div key={item.label} style={styles.metricRow}>
              <span style={styles.metricLabel}>{item.label}</span>
              <strong style={styles.metricValue}>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.metricBlock}>
          <span style={styles.metricLabel}>{summary.label}</span>
          <strong style={styles.mainMetric}>{summary.value}</strong>
        </div>
      )}

      <div style={styles.body}>
        {error ? (
          <div style={styles.errorState}>
            <p style={styles.errorText}>{error}</p>
            <button
              type="button"
              style={styles.retryButton}
              onClick={() => setLocalRefreshKey((prev) => prev + 1)}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            {loading && <div style={styles.loadingOverlay}>Updating...</div>}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #eaecf0",
    padding: "12px 14px",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.03)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "6px"
  },
  title: {
    fontSize: "12px",
    color: "#344054",
    fontWeight: 600
  },
  refreshIcon: {
    cursor: "pointer",
    color: "#98a2b3"
  },
  metricBlock: {
    marginBottom: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  metricList: {
    marginBottom: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  metricRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  metricLabel: {
    fontSize: "11px",
    color: "#667085"
  },
  metricValue: {
    fontSize: "13px",
    color: "#101828"
  },
  mainMetric: {
    fontSize: "28px",
    lineHeight: 1,
    color: "#101828",
    fontWeight: 600
  },
  body: {
    minHeight: "170px",
    position: "relative"
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.55)",
    color: "#475467",
    fontSize: "12px",
    fontWeight: 600
  },
  errorState: {
    minHeight: "170px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  errorText: {
    margin: 0,
    fontSize: "12px",
    color: "#b42318"
  },
  retryButton: {
    border: "1px solid #d0d5dd",
    background: "#ffffff",
    color: "#344054",
    borderRadius: "8px",
    padding: "6px 10px",
    fontSize: "12px",
    cursor: "pointer"
  }
};

export default ChartCard;
