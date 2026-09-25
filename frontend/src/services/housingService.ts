const API_URL = '/api/housing';

/** The cities the dashboard compares. */
export type City = 'Toronto' | 'Hamilton';

export interface HousingRatio {
    city: string;
    year: number;
    month: number;
    ratio: number;
}

export interface HousingTotal {
    city: string;
    year: number;
    month: number;
    totalStarts: number;
    totalCompletions: number;
}

export interface OccupationData {
    city: string;
    occupation: string;
}

export interface FamilyTypeData {
    city: string;
    familyType: string;
}

export interface ImmigrationData {
    city: string;
    year: number;
    month: number;
    immigrantStatus: string;
}

/** Fetches a list from the backend, and throws when the request fails. */
async function fetchApi<T>(endpoint: string): Promise<T[]> {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}

/** Housing completion ratios for each city and month. */
export const getHousingCompletionRatios = (): Promise<HousingRatio[]> =>
    fetchApi<HousingRatio>('/starts-completions/ratio');

/** Total housing starts and completions for each city and month. */
export const getHousingTotalStartsCompletions = (): Promise<HousingTotal[]> =>
    fetchApi<HousingTotal>('/starts-completions/total');

/** The occupation of each surveyed worker. */
export const getLabourMarketOccupations = (): Promise<OccupationData[]> =>
    fetchApi<OccupationData>('/labour-market/occupation');

/** The family type of each survey record. */
export const getLabourMarketFamilyTypes = (): Promise<FamilyTypeData[]> =>
    fetchApi<FamilyTypeData>('/labour-market/family-type');

/** The immigrant status of each survey record, by month. */
export const getLabourMarketImmigration = (): Promise<ImmigrationData[]> =>
    fetchApi<ImmigrationData>('/labour-market/immigration-data');
