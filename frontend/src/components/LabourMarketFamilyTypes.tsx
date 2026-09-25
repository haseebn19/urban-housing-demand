import React, {useCallback} from 'react';
import {Bar} from 'react-chartjs-2';
import type {ChartData} from 'chart.js';
import '../chartSetup';
import {getLabourMarketFamilyTypes, type City, type FamilyTypeData} from '../services/housingService';
import {useChartData} from '../hooks/useChartData';
import {useChartOptions} from '../hooks/useChartOptions';
import {countBy} from '../utils/chartData';
import ChartCard from './ChartCard';

const COLORS: Record<City, {bg: string; border: string}> = {
    Toronto: {bg: 'rgba(251, 146, 60, 0.6)', border: '#fb923c'},
    Hamilton: {bg: 'rgba(168, 85, 247, 0.6)', border: '#a855f7'}
};

/** People surveyed in each family type, or a message when there is nothing to plot. */
function familyTypeChart(rows: FamilyTypeData[], city: City): ChartData<'bar'> | string {
    const counts = countBy(
        rows.filter((row) => row.city === city),
        (row) => row.familyType
    );
    if (counts.size === 0) return `No family type data available for ${city}.`;

    return {
        labels: [...counts.keys()],
        datasets: [
            {
                label: `People (${city})`,
                data: [...counts.values()],
                backgroundColor: COLORS[city].bg,
                borderColor: COLORS[city].border,
                borderWidth: 1
            }
        ]
    };
}

const LabourMarketFamilyTypes: React.FC<{city: City}> = ({city}) => {
    const chartOptions = useChartOptions({title: `${city} Family Types`, horizontal: true, counts: true});
    const build = useCallback((rows: FamilyTypeData[]) => familyTypeChart(rows, city), [city]);
    const {data, loading, error} = useChartData(getLabourMarketFamilyTypes, build, 'Failed to load family type data.');

    return (
        <ChartCard
            title={`Family Type Distribution (${city})`}
            testId={`labour-family-types-${city.toLowerCase()}`}
            loading={loading}
            error={error}
            tall
        >
            {data && <Bar data={data} options={chartOptions} />}
        </ChartCard>
    );
};

export default LabourMarketFamilyTypes;
