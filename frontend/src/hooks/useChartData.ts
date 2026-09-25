import {useEffect, useState} from 'react';

interface ChartDataState<Data> {
    data: Data | null;
    loading: boolean;
    error: string | null;
}

interface Settled<Row, Data> {
    load: () => Promise<Row[]>;
    build: (rows: Row[]) => Data | string;
    data: Data | null;
    error: string | null;
}

/**
 * Load rows from the API and turn them into chart data.
 *
 * `build` returns the chart data, or a message to show instead when the rows have nothing to
 * plot. Changing `load` or `build` reloads, so pass stable functions (wrap `build` in useCallback).
 */
export function useChartData<Row, Data>(
    load: () => Promise<Row[]>,
    build: (rows: Row[]) => Data | string,
    failureMessage: string
): ChartDataState<Data> {
    const [settled, setSettled] = useState<Settled<Row, Data> | null>(null);

    useEffect(() => {
        let isMounted = true;
        load()
            .then((rows) => {
                if (!isMounted) return;
                const result = build(rows);
                setSettled(
                    typeof result === 'string'
                        ? {load, build, data: null, error: result}
                        : {load, build, data: result, error: null}
                );
            })
            .catch(() => {
                if (isMounted) setSettled({load, build, data: null, error: failureMessage});
            });
        return () => {
            isMounted = false;
        };
    }, [load, build, failureMessage]);

    // Until the current request finishes, any earlier result is out of date
    if (!settled || settled.load !== load || settled.build !== build) {
        return {data: null, loading: true, error: null};
    }
    return {data: settled.data, loading: false, error: settled.error};
}
