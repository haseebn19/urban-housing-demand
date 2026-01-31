import React from 'react';
import {useTheme} from '../ThemeContext';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  testId?: string;
  loading: boolean;
  error: string | null;
  hasData: boolean;
  children: React.ReactNode;
}

/**
 * Reusable card wrapper for all chart components.
 * Provides consistent styling, loading states, and error handling.
 */
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  testId,
  loading,
  error,
  hasData,
  children,
}) => {
  const {theme} = useTheme();

  return (
    <section
      className={`chart-card ${theme}`}
      data-testid={testId}
    >
      <h2 className="chart-card__title">{title}</h2>
      <div className="chart-card__content">
        {loading ? (
          <div className="chart-card__status">
            <div className="chart-card__spinner" />
            <p>Loading data...</p>
          </div>
        ) : error ? (
          <div className="chart-card__status chart-card__status--error">
            <p>{error}</p>
          </div>
        ) : hasData ? (
          <div className="chart-card__chart">{children}</div>
        ) : (
          <div className="chart-card__status">
            <p>No data available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChartCard;
