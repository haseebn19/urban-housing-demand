import {describe, it, expect, beforeEach, vi} from 'vitest';
import {
  getLabourMarketFamilyTypes,
  getHousingCompletionRatios,
  getHousingTotalStartsCompletions,
  getLabourMarketOccupations,
} from './housingService';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe('housingService', () => {
  describe('getHousingCompletionRatios', () => {
    it('successfully fetches housing completion ratio data', async () => {
      const mockData = [{id: 1, name: 'Test Data'}];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const data = await getHousingCompletionRatios();
      expect(data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/housing/starts-completions/ratio');
    });

    it('handles fetch failure for completion ratios', async () => {
      mockFetch.mockResolvedValueOnce({ok: false, status: 500});

      await expect(getHousingCompletionRatios()).rejects.toThrow('HTTP error');
    });
  });

  describe('getHousingTotalStartsCompletions', () => {
    it('successfully fetches total housing starts and completions data', async () => {
      const mockData = [{id: 1, name: 'Test Data'}];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const data = await getHousingTotalStartsCompletions();
      expect(data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/housing/starts-completions/total');
    });

    it('handles fetch failure for total starts/completions', async () => {
      mockFetch.mockResolvedValueOnce({ok: false, status: 500});

      await expect(getHousingTotalStartsCompletions()).rejects.toThrow('HTTP error');
    });
  });

  describe('getLabourMarketOccupations', () => {
    it('successfully fetches labour market occupation data', async () => {
      const mockData = [
        {city: 'Hamilton', occupation: 'Engineer', count: 150},
        {city: 'Toronto', occupation: 'Teacher', count: 120},
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const data = await getLabourMarketOccupations();
      expect(data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/housing/labour-market/occupation');
    });

    it('handles fetch failure for labour market occupation data', async () => {
      mockFetch.mockResolvedValueOnce({ok: false, status: 500});

      await expect(getLabourMarketOccupations()).rejects.toThrow('HTTP error');
    });
  });

  describe('getLabourMarketFamilyTypes', () => {
    it('successfully fetches labour market family types data', async () => {
      const mockData = [
        {city: 'Hamilton', familyType: 'Single Parent', count: 200},
        {city: 'Toronto', familyType: 'Couple with Children', count: 350},
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const data = await getLabourMarketFamilyTypes();
      expect(data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/api/housing/labour-market/family-type');
    });

    it('handles fetch failure for labour market family types data', async () => {
      mockFetch.mockResolvedValueOnce({ok: false, status: 500});

      await expect(getLabourMarketFamilyTypes()).rejects.toThrow('HTTP error');
    });
  });
});
