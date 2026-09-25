// Used by tests that call vi.mock('react-chartjs-2'). Each chart prints its datasets' labels and
// values as text, so a test can check what would be plotted.

interface ChartProps {
    data: {labels: string[]; datasets: {label: string; data: (number | null)[]}[]};
}

const Chart = ({data}: ChartProps) => (
    <div data-testid="chart">
        {data.datasets
            .map((set) => `${set.label}: ` + data.labels.map((label, i) => `${label}=${set.data[i]}`).join(' '))
            .join(' | ')}
    </div>
);

export const Bar = Chart;
export const Line = Chart;
