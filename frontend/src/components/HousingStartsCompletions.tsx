import React, {useEffect, useState, useMemo} from "react";
import {Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {useTheme} from "../ThemeContext";
import {getHousingTotalStartsCompletions} from "../services/housingService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface HousingEntry {
  city: string;
  year: number;
  month: number;
  totalStarts: number;
  totalCompletions: number;
}

interface HousingStartsCompletionsProps {
  city: "Toronto" | "Hamilton";
}

// City-specific colors
const CITY_COLORS = {
  Toronto: {
    starts: "rgba(0, 200, 0, 0.6)",
    completions: "rgba(0, 200, 0, 1)",
  },
  Hamilton: {
    starts: "rgba(0, 123, 255, 0.6)",
    completions: "rgba(0, 123, 255, 1)",
  },
};

const HousingStartsCompletions: React.FC<HousingStartsCompletionsProps> = ({city}) => {
  const {theme} = useTheme();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const colors = CITY_COLORS[city];

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const allData: HousingEntry[] = await getHousingTotalStartsCompletions();

        if (!isMounted) return;

        // Filter for specified city
        const cityData = allData.filter((entry) => entry.city === city);

        if (cityData.length === 0) {
          setChartData(null);
          setError(`No data available for ${city}`);
          return;
        }

        // Group by (year, month) to avoid duplicates
        const groupedMap = new Map<
          string,
          {year: number; month: number; totalStarts: number; totalCompletions: number}
        >();

        for (const row of cityData) {
          const ymKey = `${row.year}-${row.month}`;
          if (!groupedMap.has(ymKey)) {
            groupedMap.set(ymKey, {
              year: row.year,
              month: row.month,
              totalStarts: 0,
              totalCompletions: 0,
            });
          }
          const existing = groupedMap.get(ymKey)!;
          existing.totalStarts += row.totalStarts;
          existing.totalCompletions += row.totalCompletions;
        }

        // Convert map to sorted array
        const groupedArray = Array.from(groupedMap.values()).sort((a, b) => {
          const dateA = a.year * 100 + a.month;
          const dateB = b.year * 100 + b.month;
          return dateA - dateB;
        });

        // Build chart data
        const newChartData: ChartData = {
          labels: groupedArray.map(
            (item) => `${item.year}-${String(item.month).padStart(2, "0")}`
          ),
          datasets: [
            {
              label: `Total Starts (${city})`,
              data: groupedArray.map((item) => item.totalStarts),
              backgroundColor: colors.starts,
            },
            {
              label: `Total Completions (${city})`,
              data: groupedArray.map((item) => item.totalCompletions),
              backgroundColor: colors.completions,
            },
          ],
        };

        setChartData(newChartData);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load housing data");
          console.error(`Error fetching ${city} housing data:`, err);
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
          text: `Housing Starts and Completions (${city})`,
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
      height: "600px",
    }),
    [theme]
  );

  return (
    <section data-testid={`housing-starts-${city.toLowerCase()}`} style={containerStyle}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        Housing Starts and Completions ({city})
      </h1>

      <div style={chartContainerStyle}>
        {loading ? (
          <p>Loading chart data...</p>
        ) : error ? (
          <p style={{color: "red"}}>{error}</p>
        ) : chartData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>No data available for {city}.</p>
        )}
      </div>
    </section>
  );
};

export default HousingStartsCompletions;
