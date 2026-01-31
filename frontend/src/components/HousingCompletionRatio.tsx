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
import {getHousingCompletionRatios} from '../services/housingService';
import {useChartOptions} from '../hooks/useChartOptions';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

interface RawData {
  city: string;
  year: number;
  month: number;
  ratio: number;
}

function processChartData(data: RawData[]): ChartData {
  const timeLabels = [
    ...new Set(
      data.map((entry) => `${entry.year}-${String(entry.month).padStart(2, '0')}`)
    ),
  ].sort();

  const getCityRates = (city: string) =>
    timeLabels.map((date) => {
      const entry = data.find(
        (item) =>
          item.city === city &&
          `${item.year}-${String(item.month).padStart(2, '0')}` === date
      );
      return entry ? Math.round(entry.ratio * 100) : 0;
    });

  return {
    labels: timeLabels,
    datasets: [
      {
        label: 'Hamilton (%)',
        data: getCityRates('Hamilton'),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Toronto (%)',
        data: getCityRates('Toronto'),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.2)',
        tension: 0.3,
      },
    ],
  };
}

const HousingCompletionRatio: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartOptions = useChartOptions({title: 'Completion Rate Over Time'});

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setError(null);
        const apiData = await getHousingCompletionRatios();
        if (isMounted && apiData.length > 0) {
          setChartData(processChartData(apiData));
        }
      } catch {
        if (isMounted) {
          setError('Failed to load housing completion data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {isMounted = false;};
  }, []);

  return (
    <ChartCard
      title="Housing Completion Rate (Hamilton vs Toronto)"
      testId="housing-completion-ratio"
      loading={loading}
      error={error}
      hasData={chartData !== null && chartData.labels.length > 0}
    >
      {chartData && <Line data={chartData} options={chartOptions} />}
    </ChartCard>
  );
};

export default HousingCompletionRatio;
