import {
  getLabourMarketFamilyTypes, getHousingCompletionRatios, getHousingTotalStartsCompletions, getLabourMarketOccupations
} from './housingService';
import fetchMock from 'jest-fetch-mock';




beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

// it('successfully fetches housing data', async () => {
//   const mockData = [{ id: 1, name: 'Test Data' }];
//   fetchMock.mockResponseOnce(JSON.stringify(mockData));

//   const data = await getAllHousingStartsCompletions();
//   expect(data).toEqual(mockData);
//   expect(fetchMock.mock.calls.length).toEqual(1);
//   expect(fetchMock.mock.calls[0][0]).toEqual('/api/housing/starts-completions/all');
// });

it("successfully fetches housing completion ratio data", async () => {
  const mockData = [{id: 1, name: 'Test Data'}];
  fetchMock.mockResponseOnce(JSON.stringify(mockData));

  const data = await getHousingCompletionRatios();
  expect(data).toEqual(mockData);
  expect(fetchMock.mock.calls.length).toEqual(1);
  expect(fetchMock.mock.calls[0][0]).toEqual('/api/housing/starts-completions/ratio');
});

it('handles fetch failure', async () => {
  fetchMock.mockReject(new Error('API failure'));

  const data = await getHousingCompletionRatios();
  expect(data).toEqual([]);  // Check that it returns an empty array instead of throwing
});

it("Successfully fetches total housing starts and completions data", async () => {
  const mockData = [{id: 1, name: 'Test Data'}];
  fetchMock.mockResponseOnce(JSON.stringify(mockData));

  const data = await getHousingTotalStartsCompletions();
  expect(data).toEqual(mockData);
  expect(fetchMock.mock.calls.length).toEqual(1);
  expect(fetchMock.mock.calls[0][0]).toEqual('/api/housing/starts-completions/total');
});

it('handles fetch failure', async () => {
  fetchMock.mockReject(new Error('API failure'));

  const data = await getHousingTotalStartsCompletions();
  expect(data).toEqual([]);  // Check that it returns an empty array instead of throwing
});

it("successfully fetches labour market occupation data", async () => {
  const mockData = [
    {city: "Hamilton", occupation: "Engineer", count: 150},
    {city: "Toronto", occupation: "Teacher", count: 120},
  ];
  fetchMock.mockResponseOnce(JSON.stringify(mockData));

  const data = await getLabourMarketOccupations();
  expect(data).toEqual(mockData);
  expect(fetchMock.mock.calls.length).toEqual(1);
  expect(fetchMock.mock.calls[0][0]).toEqual('/api/housing/labour-market/occupation');
});

it("handles fetch failure for labour market occupation data", async () => {
  fetchMock.mockReject(new Error('API failure'));

  const data = await getLabourMarketOccupations();
  expect(data).toEqual([]);  // Check that it returns an empty array instead of throwing
});

it("successfully fetches labour market family types data", async () => {
  const mockData = [
    {city: "Hamilton", familyType: "Single Parent", count: 200},
    {city: "Toronto", familyType: "Couple with Children", count: 350},
  ];
  fetchMock.mockResponseOnce(JSON.stringify(mockData));

  const data = await getLabourMarketFamilyTypes();
  expect(data).toEqual(mockData);
  expect(fetchMock.mock.calls.length).toEqual(1);

  expect(fetchMock.mock.calls[0][0]).toContain('/labour-market/family-type');
});

it("handles fetch failure for labour market family types data", async () => {
  fetchMock.mockReject(new Error('API failure'));

  const data = await getLabourMarketFamilyTypes();
  expect(data).toEqual([]);
});
