import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top scroll position
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                'fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-300 hover:bg-neutral-800 active:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:active:bg-neutral-300',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}
