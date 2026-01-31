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
import {getLabourMarketFamilyTypes} from '../services/housingService';
import {useChartOptions} from '../hooks/useChartOptions';
import ChartCard from './ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FamilyTypeEntry {
  city: string;
  familyType: string;
}

interface Props {
  city: 'Toronto' | 'Hamilton';
}

const COLORS = {
  Toronto: {bg: 'rgba(251, 146, 60, 0.6)', border: '#fb923c'},
  Hamilton: {bg: 'rgba(168, 85, 247, 0.6)', border: '#a855f7'},
};

const LabourMarketFamilyTypes: React.FC<Props> = ({city}) => {
  const [familyTypeCounts, setFamilyTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = COLORS[city];
  const chartOptions = useChartOptions({title: `${city} Family Types`, horizontal: true});

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const allData: FamilyTypeEntry[] = await getLabourMarketFamilyTypes();

        if (!isMounted) return;

        const cityData = allData.filter((entry) => entry.city === city);

        if (cityData.length === 0) {
          setFamilyTypeCounts({});
          setError(`No family type data available for ${city}.`);
          return;
        }

        const counts: Record<string, number> = {};
        cityData.forEach((entry) => {
          counts[entry.familyType] = (counts[entry.familyType] || 0) + 1;
        });

        setFamilyTypeCounts(counts);
      } catch {
        if (isMounted) {
          setError('Failed to load family type data.');
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
      labels: Object.keys(familyTypeCounts),
      datasets: [
        {
          label: `Families (${city})`,
          data: Object.values(familyTypeCounts),
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ],
    }),
    [familyTypeCounts, city, colors]
  );

  const hasData = Object.keys(familyTypeCounts).length > 0;

  return (
    <ChartCard
      title={`Family Type Distribution (${city})`}
      testId={`labour-family-types-${city.toLowerCase()}`}
      loading={loading}
      error={error}
      hasData={hasData}
      tall
    >
      {hasData && <Bar data={chartData} options={chartOptions} />}
    </ChartCard>
  );
};

export default LabourMarketFamilyTypes;
