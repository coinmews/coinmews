import { useEffect, useState } from 'react';

/**
 * A custom hook that creates a debounced value.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set debouncedValue to value (passed in) after the specified delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Return a cleanup function that will be called every time
        // useEffect is re-called. useEffect will only be re-called
        // if value changes (see the dependency array).
        // This is how we prevent debouncedValue from changing if value is
        // changed within the delay period. Timeout gets cleared and restarted.
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
