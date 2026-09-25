import {describe, it, expect, beforeEach, vi} from 'vitest';
import {
    getLabourMarketFamilyTypes,
    getHousingCompletionRatios,
    getHousingTotalStartsCompletions,
    getLabourMarketImmigration,
    getLabourMarketOccupations
} from './housingService';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => mockFetch.mockReset());

describe('housingService', () => {
    it.each([
        {fetchList: getHousingCompletionRatios, url: '/api/housing/starts-completions/ratio'},
        {fetchList: getHousingTotalStartsCompletions, url: '/api/housing/starts-completions/total'},
        {fetchList: getLabourMarketOccupations, url: '/api/housing/labour-market/occupation'},
        {fetchList: getLabourMarketFamilyTypes, url: '/api/housing/labour-market/family-type'},
        {fetchList: getLabourMarketImmigration, url: '/api/housing/labour-market/immigration-data'}
    ])('reads the list at $url', async ({fetchList, url}) => {
        const rows = [{city: 'Toronto'}];
        mockFetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve(rows)});

        await expect(fetchList()).resolves.toEqual(rows);
        expect(mockFetch).toHaveBeenCalledWith(url);
    });

    it('throws when the backend answers with an error status', async () => {
        mockFetch.mockResolvedValueOnce({ok: false, status: 503});

        await expect(getLabourMarketImmigration()).rejects.toThrow('Request failed with status 503');
    });
});
