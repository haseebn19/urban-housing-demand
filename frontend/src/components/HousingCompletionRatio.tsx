import React, {useEffect, useState} from "react";
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
import {getHousingCompletionRatios} from "../services/housingService"; // Import your API function

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Types
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

// Helper to transform raw data into chart-friendly format
// Notice we now take the same shape returned by getHousingCompletionRatios
function processChartData(
  data: {city: string; year: number; month: number; ratio: number}[]
): ChartData {
  // Create an array of unique YYYY-MM labels
  const timeLabels = [
    ...new Set(
      data.map(
        (entry) => `${entry.year}-${String(entry.month).padStart(2, "0")}`
      )
    ),
  ];

  // For a given city, produce an array of ratio*100 values in label order
  const getCityCompletionRates = (city: string) =>
    timeLabels.map((date) => {
      const entry = data.find(
        (item) =>
          item.city === city &&
          `${item.year}-${String(item.month).padStart(2, "0")}` === date
      );
      // Multiply ratio by 100 to get a percentage
      return entry ? entry.ratio * 100 : 0;
    });

  return {
    labels: timeLabels,
    datasets: [
      {
        label: "Hamilton Completion Rate (%)",
        data: getCityCompletionRates("Hamilton"),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
      {
        label: "Toronto Completion Rate (%)",
        data: getCityCompletionRates("Toronto"),
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
      },
    ],
  };
}

const HousingCompletionRatio: React.FC = () => {
  const {theme} = useTheme(); // Using your dark/light theme
  const [chartData, setChartData] = useState<ChartData>({labels: [], datasets: []});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data instead of mock
    async function fetchData() {
      try {
        const apiData = await getHousingCompletionRatios();
        const processed = processChartData(apiData);
        setChartData(processed);
      } catch (err) {
        console.error("Error loading housing completion ratios:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section
      data-testid="housing-completion-ratio"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        color: theme === "dark" ? "#f4f4f4" : "#000000",
        backgroundColor: theme === "dark" ? "#1c1c1c" : "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        Housing Completion Rate (Hamilton vs Toronto)
      </h1>

      <div
        style={{
          backgroundColor: theme === "dark" ? "#2c2c2c" : "#f8f8f8",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {loading ? (
          <p>Loading chart data...</p>
        ) : chartData.labels.length > 0 ? (
          <div style={{width: "100%", height: "500px"}}>
            <Line
              data={chartData}
              options={{
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
                    text: "Housing Completion Rates",
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
              }}
            />
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </section>
  );
};

export default HousingCompletionRatio;
