import React, {useState} from 'react';
import Navbar from './components/Navbar';
import HousingCompletionRatio from './components/HousingCompletionRatio';
import HousingStartsCompletions from './components/HousingStartsCompletions';
import ProductPitch from './components/ProductPitch';
import LabourMarketOccupations from './components/LabourMarketOccupations';
import LabourMarketFamilyTypes from './components/LabourMarketFamilyTypes';
import Immigration from './components/Immigration';
import ErrorBoundary from './components/ErrorBoundary';
import {ThemeProvider} from './ThemeContext';

type PageType = 'pitch' | 'starts' | 'occupations' | 'family' | 'immigration';

const App: React.FC = () => {
  const [page, setPage] = useState<PageType>('pitch');

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="app">
          <Navbar currentPage={page} setPage={setPage} />

          <main className="main-content">
            {page === 'pitch' && <ProductPitch />}

            {page === 'starts' && (
              <>
                <HousingCompletionRatio />
                <HousingStartsCompletions city="Hamilton" />
                <HousingStartsCompletions city="Toronto" />
              </>
            )}

            {page === 'occupations' && (
              <>
                <LabourMarketOccupations city="Hamilton" />
                <LabourMarketOccupations city="Toronto" />
              </>
            )}

            {page === 'family' && (
              <>
                <LabourMarketFamilyTypes city="Hamilton" />
                <LabourMarketFamilyTypes city="Toronto" />
              </>
            )}

            {page === 'immigration' && (
              <>
                <Immigration city="Hamilton" />
                <Immigration city="Toronto" />
              </>
            )}
          </main>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
