import { useEffect, useState } from 'react';

export function useTheme() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        // Initial check
        const checkDarkMode = () => {
            if (typeof document !== 'undefined') {
                setIsDarkTheme(document.documentElement.classList.contains('dark'));
            }
        };

        checkDarkMode();

        // Create observer to watch for theme changes
        if (typeof document !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        checkDarkMode();
                    }
                });
            });

            // Start observing
            observer.observe(document.documentElement, { attributes: true });

            // Cleanup
            return () => observer.disconnect();
        }
    }, []);

    return { isDarkTheme };
}

export default useTheme;
