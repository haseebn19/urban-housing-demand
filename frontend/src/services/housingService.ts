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
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching ${endpoint}:`, error);
    }
    return [];
  }
}

/**
 * Fetch housing completion ratios from the backend.
 */
export const getHousingCompletionRatios = async (): Promise<HousingRatio[]> => {
  return fetchApi<HousingRatio>('/starts-completions/ratio');
};

/**
 * Fetch housing total starts and completions from the backend.
 */
export const getHousingTotalStartsCompletions = async (): Promise<HousingTotal[]> => {
  return fetchApi<HousingTotal>('/starts-completions/total');
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
  return fetchApi<ImmigrationData>('/labour-market/immigration-data');
};
