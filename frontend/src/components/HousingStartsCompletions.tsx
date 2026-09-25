import React, {useCallback} from 'react';
import {Bar} from 'react-chartjs-2';
import type {ChartData} from 'chart.js';
import '../chartSetup';
import {getHousingTotalStartsCompletions, type City, type HousingTotal} from '../services/housingService';
import {useChartData} from '../hooks/useChartData';
import {useChartOptions} from '../hooks/useChartOptions';
import {monthLabel} from '../utils/chartData';
import ChartCard from './ChartCard';

const COLORS: Record<City, Record<'starts' | 'completions', {bg: string; border: string}>> = {
    Toronto: {
        starts: {bg: 'rgba(34, 197, 94, 0.7)', border: '#22c55e'},
        completions: {bg: 'rgba(249, 115, 22, 0.7)', border: '#f97316'}
    },
    Hamilton: {
        starts: {bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6'},
        completions: {bg: 'rgba(168, 85, 247, 0.7)', border: '#a855f7'}
    }
};

/** Housing starts and completions per month, or a message when there is nothing to plot. */
function startsCompletionsChart(rows: HousingTotal[], city: City): ChartData<'bar'> | string {
    const cityRows = rows.filter((row) => row.city === city);
    if (cityRows.length === 0) return `No data available for ${city}.`;

    // Add up the rows for each month
    const totals = new Map<string, {starts: number; completions: number}>();
    for (const row of cityRows) {
        const month = monthLabel(row.year, row.month);
        const total = totals.get(month) ?? {starts: 0, completions: 0};
        total.starts += row.totalStarts;
        total.completions += row.totalCompletions;
        totals.set(month, total);
    }
    const months = [...totals.keys()].sort();
    const colors = COLORS[city];

    return {
        labels: months,
        datasets: (['starts', 'completions'] as const).map((series) => ({
            label: series === 'starts' ? 'Starts' : 'Completions',
            data: months.map((month) => totals.get(month)?.[series] ?? 0),
            backgroundColor: colors[series].bg,
            borderColor: colors[series].border,
            borderWidth: 1
        }))
    };
}

const HousingStartsCompletions: React.FC<{city: City}> = ({city}) => {
    const chartOptions = useChartOptions({title: `${city} Housing Activity`, counts: true});
    const build = useCallback((rows: HousingTotal[]) => startsCompletionsChart(rows, city), [city]);
    const {data, loading, error} = useChartData(
        getHousingTotalStartsCompletions,
        build,
        'Failed to load housing data.'
    );

    return (
        <ChartCard
            title={`Housing Starts & Completions (${city})`}
            testId={`housing-starts-${city.toLowerCase()}`}
            loading={loading}
            error={error}
        >
            {data && <Bar data={data} options={chartOptions} />}
        </ChartCard>
    );
};

export default HousingStartsCompletions;
