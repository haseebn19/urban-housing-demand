import React, {useEffect, useState, useMemo} from 'react';
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
import {getLabourMarketOccupations} from '../services/housingService';
import {useChartOptions} from '../hooks/useChartOptions';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OccupationEntry {
  city: string;
  occupation: string;
}

interface Props {
  city: 'Toronto' | 'Hamilton';
}

const COLORS = {
  Toronto: {bg: 'rgba(244, 63, 94, 0.6)', border: '#f43f5e'},
  Hamilton: {bg: 'rgba(6, 182, 212, 0.6)', border: '#06b6d4'},
};

const LabourMarketOccupations: React.FC<Props> = ({city}) => {
  const [occupationCounts, setOccupationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = COLORS[city];
  const chartOptions = useChartOptions({title: `${city} Occupations`, rotateXLabels: true});

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
          setError(`No occupation data available for ${city}.`);
          return;
        }

        const counts: Record<string, number> = {};
        cityData.forEach((entry) => {
          counts[entry.occupation] = (counts[entry.occupation] || 0) + 1;
        });

        setOccupationCounts(counts);
      } catch {
        if (isMounted) {
          setError('Failed to load occupation data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {isMounted = false;};
  }, [city]);

  const chartData = useMemo(
    () => ({
      labels: Object.keys(occupationCounts),
      datasets: [
        {
          label: `Workers (${city})`,
          data: Object.values(occupationCounts),
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ],
    }),
    [occupationCounts, city, colors]
  );

  const hasData = Object.keys(occupationCounts).length > 0;

  return (
    <ChartCard
      title={`Occupation Distribution (${city})`}
      testId={`labour-occupations-${city.toLowerCase()}`}
      loading={loading}
      error={error}
      hasData={hasData}
    >
      {hasData && <Bar data={chartData} options={chartOptions} />}
    </ChartCard>
  );
};

export default LabourMarketOccupations;
