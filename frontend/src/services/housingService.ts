const API_URL = '/api/housing';

interface HousingRatio {
  city: string;
  year: number;
  month: number;
  ratio: number;
}

interface HousingTotal {
  city: string;
  year: number;
  month: number;
  totalStarts: number;
  totalCompletions: number;
}

interface OccupationData {
  city: string;
  occupation: string;
}

interface FamilyTypeData {
  city: string;
  familyType: string;
}

interface ImmigrationData {
  city: string;
  year: number;
  month: number;
  immigrantStatus: string;
}

/**
 * Generic fetch wrapper with error handling and type normalization
 */
async function fetchApi<T>(endpoint: string, normalizer?: (data: T[]) => T[]): Promise<T[]> {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return normalizer ? normalizer(data) : data;
}

/**
 * Normalizes year/month fields from string to number
 */
function normalizeTimeFields<T extends {year?: unknown; month?: unknown}>(data: T[]): T[] {
  return data.map(item => ({
    ...item,
    year: typeof item.year === 'string' ? parseInt(item.year, 10) : item.year,
    month: typeof item.month === 'string' ? parseInt(item.month, 10) : item.month,
  }));
}

/**
 * Fetch housing completion ratios from the backend.
 */
export const getHousingCompletionRatios = async (): Promise<HousingRatio[]> => {
  return fetchApi<HousingRatio>('/starts-completions/ratio', normalizeTimeFields);
};

/**
 * Fetch housing total starts and completions from the backend.
 */
export const getHousingTotalStartsCompletions = async (): Promise<HousingTotal[]> => {
  return fetchApi<HousingTotal>('/starts-completions/total', normalizeTimeFields);
};

/**
 * Fetch labour market occupations data from the backend.
 */
export const getLabourMarketOccupations = async (): Promise<OccupationData[]> => {
  return fetchApi<OccupationData>('/labour-market/occupation');
};

/**
 * Fetch labour market family type data from the backend.
 */
export const getLabourMarketFamilyTypes = async (): Promise<FamilyTypeData[]> => {
  return fetchApi<FamilyTypeData>('/labour-market/family-type');
};

/**
 * Fetch labour market immigration data from the backend.
 */
export const getLabourMarketImmigration = async (): Promise<ImmigrationData[]> => {
  return fetchApi<ImmigrationData>('/labour-market/immigration-data', normalizeTimeFields);
};
