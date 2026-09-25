import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ThemeProvider} from '../ThemeContext';
import HousingCompletionRatio from '../components/HousingCompletionRatio';
import HousingStartsCompletions from '../components/HousingStartsCompletions';
import Immigration from '../components/Immigration';
import LabourMarketFamilyTypes from '../components/LabourMarketFamilyTypes';
import LabourMarketOccupations from '../components/LabourMarketOccupations';
import * as housingService from '../services/housingService';

vi.mock('../services/housingService');
// Charts print what they would plot; see __mocks__/react-chartjs-2.tsx
vi.mock('react-chartjs-2');
const service = vi.mocked(housingService);

const renderChart = (chart: React.ReactElement) => render(<ThemeProvider>{chart}</ThemeProvider>);

beforeEach(() => vi.resetAllMocks());

describe('housing starts and completions chart', () => {
    it('shows a loading message until the data arrives', () => {
        service.getHousingTotalStartsCompletions.mockReturnValue(new Promise(() => {}));

        renderChart(<HousingStartsCompletions city="Hamilton" />);

        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('adds up the starts and completions in each month for the city', async () => {
        service.getHousingTotalStartsCompletions.mockResolvedValue([
            {city: 'Hamilton', year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
            {city: 'Hamilton', year: 2023, month: 1, totalStarts: 10, totalCompletions: 5},
            {city: 'Hamilton', year: 2023, month: 2, totalStarts: 50, totalCompletions: 40},
            {city: 'Toronto', year: 2023, month: 1, totalStarts: 200, totalCompletions: 150}
        ]);

        renderChart(<HousingStartsCompletions city="Hamilton" />);

        expect(await screen.findByTestId('chart')).toHaveTextContent(
            'Starts: 2023-01=110 2023-02=50 | Completions: 2023-01=85 2023-02=40'
        );
    });

    it('says so when the city has no data', async () => {
        service.getHousingTotalStartsCompletions.mockResolvedValue([
            {city: 'Toronto', year: 2023, month: 1, totalStarts: 200, totalCompletions: 150}
        ]);

        renderChart(<HousingStartsCompletions city="Hamilton" />);

        expect(await screen.findByText('No data available for Hamilton.')).toBeInTheDocument();
    });

    it('reports a failed request', async () => {
        service.getHousingTotalStartsCompletions.mockRejectedValue(new Error('offline'));

        renderChart(<HousingStartsCompletions city="Toronto" />);

        expect(await screen.findByText('Failed to load housing data.')).toBeInTheDocument();
    });
});

describe('housing completion rate chart', () => {
    it('leaves a gap for a month a city has no data for', async () => {
        service.getHousingCompletionRatios.mockResolvedValue([
            {city: 'Hamilton', year: 2023, month: 1, ratio: 0.5},
            {city: 'Hamilton', year: 2023, month: 2, ratio: 0.25},
            {city: 'Toronto', year: 2023, month: 2, ratio: 0.8}
        ]);

        renderChart(<HousingCompletionRatio />);

        expect(await screen.findByTestId('chart')).toHaveTextContent(
            'Hamilton (%): 2023-01=50 2023-02=25 | Toronto (%): 2023-01=null 2023-02=80'
        );
    });
});

describe('labour market charts', () => {
    it('counts workers in each occupation for the city', async () => {
        service.getLabourMarketOccupations.mockResolvedValue([
            {city: 'Toronto', occupation: 'General trades'},
            {city: 'Toronto', occupation: 'Professional occupations in law'},
            {city: 'Toronto', occupation: 'General trades'},
            {city: 'Hamilton', occupation: 'General trades'}
        ]);

        renderChart(<LabourMarketOccupations city="Toronto" />);

        expect(await screen.findByTestId('chart')).toHaveTextContent(
            'Workers (Toronto): General trades=2 Professional occupations in law=1'
        );
    });

    it('counts families of each type for the city', async () => {
        service.getLabourMarketFamilyTypes.mockResolvedValue([
            {city: 'Hamilton', familyType: 'Other families'},
            {city: 'Hamilton', familyType: 'Other families'}
        ]);

        renderChart(<LabourMarketFamilyTypes city="Hamilton" />);

        expect(await screen.findByTestId('chart')).toHaveTextContent('People (Hamilton): Other families=2');
    });

    it('says so when a city has no data', async () => {
        service.getLabourMarketFamilyTypes.mockResolvedValue([{city: 'Toronto', familyType: 'Other families'}]);

        renderChart(<LabourMarketFamilyTypes city="Hamilton" />);

        expect(await screen.findByText('No family type data available for Hamilton.')).toBeInTheDocument();
    });

    it('reports a failed request', async () => {
        service.getLabourMarketOccupations.mockRejectedValue(new Error('offline'));

        renderChart(<LabourMarketOccupations city="Toronto" />);

        expect(await screen.findByText('Failed to load occupation data.')).toBeInTheDocument();
    });
});

describe('immigration chart', () => {
    it('counts immigrants per month and shows months without immigrants as zero', async () => {
        service.getLabourMarketImmigration.mockResolvedValue([
            {city: 'Hamilton', year: 2023, month: 1, immigrantStatus: 'Immigrant'},
            {city: 'Hamilton', year: 2023, month: 1, immigrantStatus: 'Immigrant'},
            {city: 'Hamilton', year: 2023, month: 2, immigrantStatus: 'Non-immigrant'},
            {city: 'Hamilton', year: 2023, month: 3, immigrantStatus: 'Immigrant'},
            {city: 'Toronto', year: 2023, month: 1, immigrantStatus: 'Immigrant'}
        ]);

        renderChart(<Immigration city="Hamilton" />);

        expect(await screen.findByTestId('chart')).toHaveTextContent(
            'Immigrants (Hamilton): 2023-01=2 2023-02=0 2023-03=1'
        );
    });
});
