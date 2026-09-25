import React from 'react';
import {Line} from 'react-chartjs-2';
import type {ChartData} from 'chart.js';
import '../chartSetup';
import {getHousingCompletionRatios, type City, type HousingRatio} from '../services/housingService';
import {useChartData} from '../hooks/useChartData';
import {useChartOptions} from '../hooks/useChartOptions';
import {monthLabel} from '../utils/chartData';
import ChartCard from './ChartCard';

const LINES: {city: City; border: string; bg: string}[] = [
    {city: 'Hamilton', border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)'},
    {city: 'Toronto', border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)'}
];

/** Each city's completion rate per month, or a message when there is nothing to plot. */
function completionRatioChart(rows: HousingRatio[]): ChartData<'line', (number | null)[]> | string {
    if (rows.length === 0) return 'No housing completion data available.';

    const percentByCityMonth = new Map(
        rows.map((row) => [`${row.city} ${monthLabel(row.year, row.month)}`, Math.round(row.ratio * 100)])
    );
    const months = [...new Set(rows.map((row) => monthLabel(row.year, row.month)))].sort();

    return {
        labels: months,
        datasets: LINES.map(({city, border, bg}) => ({
            label: `${city} (%)`,
            // Months without data for a city are left as gaps rather than drawn as 0%
            data: months.map((month) => percentByCityMonth.get(`${city} ${month}`) ?? null),
            borderColor: border,
            backgroundColor: bg,
            cubicInterpolationMode: 'monotone' as const
        }))
    };
}

const HousingCompletionRatio: React.FC = () => {
    const chartOptions = useChartOptions({title: 'Completion Rate Over Time'});
    const {data, loading, error} = useChartData(
        getHousingCompletionRatios,
        completionRatioChart,
        'Failed to load housing completion data.'
    );

    return (
        <ChartCard
            title="Housing Completion Rate (Hamilton vs Toronto)"
            testId="housing-completion-ratio"
            loading={loading}
            error={error}
        >
            {data && <Line data={data} options={chartOptions} />}
        </ChartCard>
    );
};

export default HousingCompletionRatio;
