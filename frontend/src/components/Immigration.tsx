import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {getLabourMarketImmigration} from '../services/housingService';
import {useChartOptions} from '../hooks/useChartOptions';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ImmigrationEntry {
  city: string;
  year: number;
  month: number;
  immigrantStatus: string;
}

interface Props {
  city: 'Toronto' | 'Hamilton';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

const COLORS = {
  Toronto: {border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)'},
  Hamilton: {border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)'},
};

const Immigration: React.FC<Props> = ({city}) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = COLORS[city];
  const chartOptions = useChartOptions({title: `Immigration Trends in ${city}`});

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
          setError(`No immigration data available for ${city}.`);
          return;
        }

        // Count immigrants per year-month
        const grouped = new Map<string, {year: number; month: number; count: number}>();

        for (const item of cityData) {
          if (item.immigrantStatus !== 'Immigrant') continue;
          const key = `${item.year}-${item.month}`;

          if (!grouped.has(key)) {
            grouped.set(key, {year: item.year, month: item.month, count: 0});
          }
          const groupedEntry = grouped.get(key);
          if (groupedEntry) groupedEntry.count += 1;
        }

        const sorted = Array.from(grouped.values()).sort(
          (a, b) => a.year * 100 + a.month - (b.year * 100 + b.month)
        );

        if (sorted.length === 0) {
          setChartData(null);
          setError(`No immigrant records found for ${city}.`);
          return;
        }

        setChartData({
          labels: sorted.map((item) => `${item.year}-${String(item.month).padStart(2, '0')}`),
          datasets: [
            {
              label: `Immigrants (${city})`,
              data: sorted.map((item) => item.count),
              borderColor: colors.border,
              backgroundColor: colors.bg,
              tension: 0.3,
            },
          ],
        });
      } catch {
        if (isMounted) {
          setError('Failed to load immigration data.');
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
      title={`Immigration Trends (${city})`}
      testId={`${city.toLowerCase()}-immigration`}
      loading={loading}
      error={error}
      hasData={chartData !== null}
    >
      {chartData && <Line data={chartData} options={chartOptions} />}
    </ChartCard>
  );
};

export default Immigration;
