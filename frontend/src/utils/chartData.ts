/** A "2023-01" label for a month. Labels in this form sort in date order. */
export function monthLabel(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}

/** How many rows have each value, in the order the values first appear. */
export function countBy<Row>(rows: Row[], valueOf: (row: Row) => string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const row of rows) {
        const value = valueOf(row);
        counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return counts;
}

/** `label`, cut short with an ellipsis when it is too long to sit beside a chart this wide. */
export function fitLabel(label: string, chartWidth: number): string {
    const maxLength = Math.max(16, Math.floor(chartWidth / 14));
    return label.length > maxLength ? `${label.slice(0, maxLength - 3).trimEnd()}...` : label;
}
