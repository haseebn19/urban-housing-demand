import {useMemo} from 'react';
import {useTheme} from '../ThemeContext';

interface ChartOptionsConfig {
  title?: string;
  rotateXLabels?: boolean;
  horizontal?: boolean;
}

/**
 * Hook to generate consistent chart options based on theme.
 */
export function useChartOptions(config: ChartOptionsConfig = {}) {
  const {theme} = useTheme();
  const {title, rotateXLabels = false, horizontal = false} = config;

  const textColor = theme === 'dark' ? '#e4e4e7' : '#1a1a2e';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return useMemo(
    () => ({
      indexAxis: horizontal ? ('y' as const) : ('x' as const),
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {size: 12},
          },
        },
        title: title
          ? {
            display: true,
            text: title,
            color: textColor,
            font: {size: 14, weight: 'bold' as const},
          }
          : {display: false},
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            maxRotation: rotateXLabels ? 45 : 0,
            minRotation: rotateXLabels ? 45 : 0,
          },
          grid: {color: gridColor},
        },
        y: {
          ticks: {
            color: textColor,
            ...(horizontal && {
              font: {size: 11},
              padding: 4,
            }),
          },
          grid: {color: gridColor},
        },
      },
    }),
    [title, rotateXLabels, horizontal, textColor, gridColor]
  );
}
