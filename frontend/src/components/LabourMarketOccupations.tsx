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
import {getLabourMarketOccupations} from "../services/housingService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OccupationEntry {
  city: string;
  occupation: string;
}

interface LabourMarketOccupationsProps {
  city: "Toronto" | "Hamilton";
}

// City-specific colors
const CITY_COLORS = {
  Toronto: "rgba(255, 99, 132, 0.6)",
  Hamilton: "rgba(75, 192, 192, 0.6)",
};

const LabourMarketOccupations: React.FC<LabourMarketOccupationsProps> = ({city}) => {
  const {theme} = useTheme();
  const [occupationCounts, setOccupationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const color = CITY_COLORS[city];

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const allData: OccupationEntry[] = await getLabourMarketOccupations();

        if (!isMounted) return;

        const cityData = allData.filter((entry) => entry.city === city);

        if (cityData.length === 0) {
          setOccupationCounts({});
          setError(`No occupation data available for ${city}`);
          return;
        }

        // Count occurrences of each occupation
        const countedOccupations: Record<string, number> = {};
        cityData.forEach((entry) => {
          countedOccupations[entry.occupation] = (countedOccupations[entry.occupation] || 0) + 1;
        });

        setOccupationCounts(countedOccupations);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load occupation data");
          console.error(`Error fetching ${city} occupations data:`, err);
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
  }, [city]);

  const chartData = useMemo(
    () => ({
      labels: Object.keys(occupationCounts),
      datasets: [
        {
          label: `Occupation Distribution (${city})`,
          data: Object.values(occupationCounts),
          backgroundColor: color,
        },
      ],
    }),
    [occupationCounts, city, color]
  );

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
          text: `Occupation Breakdown (${city})`,
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#ffffff" : "#000000",
            maxRotation: 90,
            minRotation: 45,
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
    }),
    [theme]
  );

  return (
    <section data-testid={`labour-occupations-${city.toLowerCase()}`} style={containerStyle}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        Occupation Breakdown ({city})
      </h1>

      <div style={chartContainerStyle}>
        <div style={{width: "100%", height: "600px", paddingBottom: "50px"}}>
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p style={{color: "red"}}>{error}</p>
          ) : Object.keys(occupationCounts).length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p>No occupation data available for {city}.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LabourMarketOccupations;
