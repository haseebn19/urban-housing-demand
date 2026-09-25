import {describe, it, expect} from 'vitest';
import {renderHook, waitFor} from '@testing-library/react';
import {useChartData} from '../hooks/useChartData';
import {countBy, fitLabel, monthLabel} from '../utils/chartData';

const sum = (rows: number[]) => rows.reduce((total, value) => total + value, 0);
const nothingToPlot = () => 'Nothing to plot.';

describe('useChartData', () => {
    it('is loading until the rows arrive, then holds the built data', async () => {
        const load = () => Promise.resolve([1, 2, 3]);
        const {result} = renderHook(() => useChartData(load, sum, 'Failed.'));

        expect(result.current).toEqual({data: null, loading: true, error: null});
        await waitFor(() => expect(result.current).toEqual({data: 6, loading: false, error: null}));
    });

    it('shows the message the builder returns when there is nothing to plot', async () => {
        const load = () => Promise.resolve([]);
        const {result} = renderHook(() => useChartData(load, nothingToPlot, 'Failed.'));

        await waitFor(() => expect(result.current).toEqual({data: null, loading: false, error: 'Nothing to plot.'}));
    });

    it('shows the failure message when loading fails', async () => {
        const load = () => Promise.reject(new Error('offline'));
        const {result} = renderHook(() => useChartData(load, sum, 'Failed to load.'));

        await waitFor(() => expect(result.current).toEqual({data: null, loading: false, error: 'Failed to load.'}));
    });
});

describe('chart data helpers', () => {
    it('labels months so they sort in date order', () => {
        expect(['2023-10', monthLabel(2023, 9), monthLabel(2022, 12)].sort()).toEqual([
            '2022-12',
            '2023-09',
            '2023-10'
        ]);
    });

    it('shortens labels too long for the chart width', () => {
        const label = 'Middle management occupations in retail and wholesale trade and customer services';

        expect(fitLabel(label, 1200)).toBe(label);
        expect(fitLabel(label, 340)).toBe('Middle management occ...');
    });

    it('counts rows by value in order of first appearance', () => {
        expect([...countBy(['b', 'a', 'b'], (value) => value)]).toEqual([
            ['b', 2],
            ['a', 1]
        ]);
    });
});
