import {useMemo} from 'react';
import type {Scale} from 'chart.js';
import {useTheme} from '../ThemeContext';
import {fitLabel} from '../utils/chartData';

// Category names are long, and Chart.js lets them run off the edge of a narrow chart.
// The tooltip still shows the whole name.
function fittedCategoryLabel(this: Scale, value: number | string): string {
    return fitLabel(this.getLabelForValue(Number(value)), this.chart.width);
}

interface ChartOptionsConfig {
    title?: string;
    rotateXLabels?: boolean;
    horizontal?: boolean;
    /** The values are whole-number counts: start the value axis at zero and only label whole numbers. */
    counts?: boolean;
}

/** Chart.js options in the current theme's colors. */
export function useChartOptions(config: ChartOptionsConfig = {}) {
    const {theme} = useTheme();
    const {title, rotateXLabels = false, horizontal = false, counts = false} = config;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const textColor = theme === 'dark' ? '#e4e4e7' : '#1a1a2e';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return useMemo(() => {
        // The value axis is y for vertical charts and x for horizontal ones.
        const countAxis = counts ? {beginAtZero: true} : {};
        const countTicks = counts ? {precision: 0} : {};

        return {
            indexAxis: horizontal ? ('y' as const) : ('x' as const),
            responsive: true,
            maintainAspectRatio: false,
            animation: reduceMotion ? (false as const) : undefined,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {size: 12}
                    }
                },
                title: title
                    ? {
                          display: true,
                          text: title,
                          color: textColor,
                          font: {size: 14, weight: 'bold' as const}
                      }
                    : {display: false}
            },
            scales: {
                x: {
                    ...(horizontal && countAxis),
                    ticks: {
                        color: textColor,
                        maxRotation: rotateXLabels ? 45 : 0,
                        minRotation: rotateXLabels ? 45 : 0,
                        ...(horizontal && countTicks)
                    },
                    grid: {color: gridColor}
                },
                y: {
                    ...(!horizontal && countAxis),
                    ticks: {
                        color: textColor,
                        ...(horizontal ? {font: {size: 11}, padding: 4, callback: fittedCategoryLabel} : countTicks)
                    },
                    grid: {color: gridColor}
                }
            }
        };
    }, [title, rotateXLabels, horizontal, counts, textColor, gridColor, reduceMotion]);
}
