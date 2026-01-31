import React, {useEffect, useState, useMemo} from "react";
import {Line} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {useTheme} from "../ThemeContext";
import {getLabourMarketImmigration} from "../services/housingService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ImmigrationEntry {
  city: string;
  year: number;
  month: number;
  immigrantStatus: string;
}

interface ImmigrationProps {
  city: "Toronto" | "Hamilton";
}

interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

// City-specific colors
const CITY_COLORS = {
  Toronto: {
    border: "rgba(255, 99, 132, 1)",
    background: "rgba(255, 99, 132, 0.2)",
  },
  Hamilton: {
    border: "rgba(75, 192, 192, 1)",
    background: "rgba(75, 192, 192, 0.2)",
  },
};

const Immigration: React.FC<ImmigrationProps> = ({city}) => {
  const {theme} = useTheme();
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const colors = CITY_COLORS[city];

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const allData: ImmigrationEntry[] = await getLabourMarketImmigration();

        if (!isMounted) return;

        const cityData = allData.filter((entry) => entry.city === city);

        if (cityData.length === 0) {
          setChartData(null);
          setError(`No immigration data available for ${city}`);
          return;
        }

        // Count total immigrants per (year, month)
        const groupedMap = new Map<string, {year: number; month: number; totalImmigrants: number}>();

        for (const entry of cityData) {
          if (entry.immigrantStatus !== "Immigrant") continue;
          const ymKey = `${entry.year}-${entry.month}`;

          if (!groupedMap.has(ymKey)) {
            groupedMap.set(ymKey, {year: entry.year, month: entry.month, totalImmigrants: 0});
          }
          groupedMap.get(ymKey)!.totalImmigrants += 1;
        }

        // Convert to sorted array
        const groupedArray = Array.from(groupedMap.values()).sort((a, b) => {
          return a.year * 100 + a.month - (b.year * 100 + b.month);
        });

        if (groupedArray.length === 0) {
          setChartData(null);
          setError(`No immigrant data found for ${city}`);
          return;
        }

        setChartData({
          labels: groupedArray.map(
            (item) => `${item.year}-${String(item.month).padStart(2, "0")}`
          ),
          datasets: [
            {
              label: `Total Immigrants (${city})`,
              data: groupedArray.map((item) => item.totalImmigrants),
              borderColor: colors.border,
              backgroundColor: colors.background,
              tension: 0.2,
            },
          ],
        });
      } catch (err) {
        if (isMounted) {
          setError("Failed to load immigration data");
          console.error(`Error fetching ${city} immigration data:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [city, colors]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
        title: {
          display: true,
          text: `Total Immigrants in ${city}`,
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
        y: {
          ticks: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
    }),
    [theme, city]
  );

  const containerStyle = useMemo(
    () => ({
      maxWidth: "900px",
      margin: "0 auto",
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      color: theme === "dark" ? "#f4f4f4" : "#000000",
      backgroundColor: theme === "dark" ? "#1c1c1c" : "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center" as const,
    }),
    [theme]
  );

  const chartContainerStyle = useMemo(
    () => ({
      backgroundColor: theme === "dark" ? "#2c2c2c" : "#f8f8f8",
      padding: "20px",
      borderRadius: "8px",
      height: "500px",
    }),
    [theme]
  );

  return (
    <section data-testid={`${city.toLowerCase()}-immigration`} style={containerStyle}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        Immigration Trends ({city})
      </h1>

      <div style={chartContainerStyle}>
        {loading ? (
          <p>Loading chart data...</p>
        ) : error ? (
          <p style={{color: "red"}}>{error}</p>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </section>
  );
};

export default Immigration;
