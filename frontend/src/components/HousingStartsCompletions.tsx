import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {getHousingTotalStartsCompletions} from '../services/housingService';
import {useChartOptions} from '../hooks/useChartOptions';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface HousingEntry {
  city: string;
  year: number;
  month: number;
  totalStarts: number;
  totalCompletions: number;
}

interface Props {
  city: 'Toronto' | 'Hamilton';
}

const COLORS = {
  Toronto: {
    starts: {bg: 'rgba(34, 197, 94, 0.6)', border: '#22c55e'},
    completions: {bg: 'rgba(34, 197, 94, 0.9)', border: '#16a34a'},
  },
  Hamilton: {
    starts: {bg: 'rgba(59, 130, 246, 0.6)', border: '#3b82f6'},
    completions: {bg: 'rgba(59, 130, 246, 0.9)', border: '#2563eb'},
  },
};

const HousingStartsCompletions: React.FC<Props> = ({city}) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = COLORS[city];
  const chartOptions = useChartOptions({title: `${city} Housing Activity`});

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const allData: HousingEntry[] = await getHousingTotalStartsCompletions();

        if (!isMounted) return;

        const cityData = allData.filter((entry) => entry.city === city);

        if (cityData.length === 0) {
          setChartData(null);
          setError(`No data available for ${city}.`);
          return;
        }

        // Group by year-month
        const grouped = new Map<string, {year: number; month: number; starts: number; completions: number}>();

        for (const row of cityData) {
          const key = `${row.year}-${row.month}`;
          if (!grouped.has(key)) {
            grouped.set(key, {year: row.year, month: row.month, starts: 0, completions: 0});
          }
          const entry = grouped.get(key);
          if (!entry) continue;
          entry.starts += row.totalStarts;
          entry.completions += row.totalCompletions;
        }

        const sorted = Array.from(grouped.values()).sort(
          (a, b) => a.year * 100 + a.month - (b.year * 100 + b.month)
        );

        setChartData({
          labels: sorted.map((item) => `${item.year}-${String(item.month).padStart(2, '0')}`),
          datasets: [
            {
              label: 'Starts',
              data: sorted.map((item) => item.starts),
              backgroundColor: colors.starts.bg,
              borderColor: colors.starts.border,
              borderWidth: 1,
            },
            {
              label: 'Completions',
              data: sorted.map((item) => item.completions),
              backgroundColor: colors.completions.bg,
              borderColor: colors.completions.border,
              borderWidth: 1,
            },
          ],
        });
      } catch {
        if (isMounted) {
          setError('Failed to load housing data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {isMounted = false;};
  }, [city, colors]);

  return (
    <ChartCard
      title={`Housing Starts & Completions (${city})`}
      testId={`housing-starts-${city.toLowerCase()}`}
      loading={loading}
      error={error}
      hasData={chartData !== null}
    >
      {chartData && <Bar data={chartData} options={chartOptions} />}
    </ChartCard>
  );
};

export default HousingStartsCompletions;
