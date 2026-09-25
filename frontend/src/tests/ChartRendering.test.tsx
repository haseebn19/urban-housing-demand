import {describe, it, expect, vi} from 'vitest';
import {render, waitFor} from '@testing-library/react';
import {ThemeProvider} from '../ThemeContext';
import HousingCompletionRatio from '../components/HousingCompletionRatio';
import HousingStartsCompletions from '../components/HousingStartsCompletions';
import * as housingService from '../services/housingService';

vi.mock('../services/housingService');
const service = vi.mocked(housingService);

// Uses the real Chart.js, which throws when a chart needs a part chartSetup.ts did not register
describe('Chart.js setup', () => {
    it('draws line and bar charts', async () => {
        service.getHousingCompletionRatios.mockResolvedValue([{city: 'Hamilton', year: 2023, month: 1, ratio: 0.5}]);
        service.getHousingTotalStartsCompletions.mockResolvedValue([
            {city: 'Hamilton', year: 2023, month: 1, totalStarts: 100, totalCompletions: 80}
        ]);

        const {container} = render(
            <ThemeProvider>
                <HousingCompletionRatio />
                <HousingStartsCompletions city="Hamilton" />
            </ThemeProvider>
        );

        await waitFor(() => expect(container.querySelectorAll('canvas')).toHaveLength(2));
    });
});
