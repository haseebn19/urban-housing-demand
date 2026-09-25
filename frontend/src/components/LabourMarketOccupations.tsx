import React, {useCallback} from 'react';
import {Bar} from 'react-chartjs-2';
import type {ChartData} from 'chart.js';
import '../chartSetup';
import {getLabourMarketOccupations, type City, type OccupationData} from '../services/housingService';
import {useChartData} from '../hooks/useChartData';
import {useChartOptions} from '../hooks/useChartOptions';
import {countBy} from '../utils/chartData';
import ChartCard from './ChartCard';

const COLORS: Record<City, {bg: string; border: string}> = {
    Toronto: {bg: 'rgba(244, 63, 94, 0.6)', border: '#f43f5e'},
    Hamilton: {bg: 'rgba(6, 182, 212, 0.6)', border: '#06b6d4'}
};

/** Workers surveyed in each occupation, or a message when there is nothing to plot. */
function occupationChart(rows: OccupationData[], city: City): ChartData<'bar'> | string {
    const counts = countBy(
        rows.filter((row) => row.city === city),
        (row) => row.occupation
    );
    if (counts.size === 0) return `No occupation data available for ${city}.`;

    return {
        labels: [...counts.keys()],
        datasets: [
            {
                label: `Workers (${city})`,
                data: [...counts.values()],
                backgroundColor: COLORS[city].bg,
                borderColor: COLORS[city].border,
                borderWidth: 1
            }
        ]
    };
}

const LabourMarketOccupations: React.FC<{city: City}> = ({city}) => {
    const chartOptions = useChartOptions({title: `${city} Occupations`, horizontal: true, counts: true});
    const build = useCallback((rows: OccupationData[]) => occupationChart(rows, city), [city]);
    const {data, loading, error} = useChartData(getLabourMarketOccupations, build, 'Failed to load occupation data.');

    return (
        <ChartCard
            title={`Occupation Distribution (${city})`}
            testId={`labour-occupations-${city.toLowerCase()}`}
            loading={loading}
            error={error}
            tall
        >
            {data && <Bar data={data} options={chartOptions} />}
        </ChartCard>
    );
};

export default LabourMarketOccupations;
