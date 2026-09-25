import React from 'react';
import './ChartCard.css';

interface ChartCardProps {
    title: string;
    testId?: string;
    loading: boolean;
    error: string | null;
    tall?: boolean;
    children: React.ReactNode;
}

/** A titled chart, with a spinner while its data loads and a message when it cannot be drawn. */
const ChartCard: React.FC<ChartCardProps> = ({title, testId, loading, error, tall = false, children}) => {
    return (
        <section className="chart-card" data-testid={testId}>
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
                ) : (
                    <div className={`chart-card__chart ${tall ? 'chart-card__chart--tall' : ''}`}>{children}</div>
                )}
            </div>
        </section>
    );
};

export default ChartCard;
