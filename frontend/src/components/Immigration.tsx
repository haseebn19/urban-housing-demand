import React, {useCallback} from 'react';
import {Line} from 'react-chartjs-2';
import type {ChartData} from 'chart.js';
import '../chartSetup';
import {getLabourMarketImmigration, type City, type ImmigrationData} from '../services/housingService';
import {useChartData} from '../hooks/useChartData';
import {useChartOptions} from '../hooks/useChartOptions';
import {monthLabel} from '../utils/chartData';
import ChartCard from './ChartCard';

const COLORS: Record<City, {border: string; bg: string}> = {
    Toronto: {border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)'},
    Hamilton: {border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)'}
};

/** Immigrants surveyed in each month, or a message when there is nothing to plot. */
function immigrationChart(rows: ImmigrationData[], city: City): ChartData<'line'> | string {
    const cityRows = rows.filter((row) => row.city === city);
    if (cityRows.length === 0) return `No immigration data available for ${city}.`;

    // Every month in the data gets a count, so months without immigrants show as zero
    const counts = new Map<string, number>();
    for (const row of cityRows) {
        const month = monthLabel(row.year, row.month);
        counts.set(month, (counts.get(month) ?? 0) + (row.immigrantStatus === 'Immigrant' ? 1 : 0));
    }
    const months = [...counts.keys()].sort();
    if (months.every((month) => counts.get(month) === 0)) return `No immigrant records found for ${city}.`;

    return {
        labels: months,
        datasets: [
            {
                label: `Immigrants (${city})`,
                data: months.map((month) => counts.get(month) ?? 0),
                borderColor: COLORS[city].border,
                backgroundColor: COLORS[city].bg,
                cubicInterpolationMode: 'monotone'
            }
        ]
    };
}

const Immigration: React.FC<{city: City}> = ({city}) => {
    const chartOptions = useChartOptions({title: `Immigration Trends in ${city}`, counts: true});
    const build = useCallback((rows: ImmigrationData[]) => immigrationChart(rows, city), [city]);
    const {data, loading, error} = useChartData(getLabourMarketImmigration, build, 'Failed to load immigration data.');

    return (
        <ChartCard
            title={`Immigration Trends (${city})`}
            testId={`${city.toLowerCase()}-immigration`}
            loading={loading}
            error={error}
        >
            {data && <Line data={data} options={chartOptions} />}
        </ChartCard>
    );
};

export default Immigration;
