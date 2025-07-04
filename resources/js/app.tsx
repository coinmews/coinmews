import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import BackToTop from './components/back-to-top';
import { useEffect } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'CoinMews';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Wrap the App component to include BackToTop and set lang attribute
        const AppWithBackToTop = () => {
            useEffect(() => {
                if (typeof document !== 'undefined') {
                    document.documentElement.lang = 'en';
                }
            }, []);
            return (
                <>
                    <App {...props} />
                    <BackToTop />
                </>
            );
        };

        root.render(<AppWithBackToTop />);
    },
    progress: {
        color: '#2563eb',
    },
});

// Track page views when routes change
router.on('navigate', (event) => {
    if (typeof gtag === 'function') {
        gtag('config', 'G-GDY6D00NV5', {
            page_path: event.detail.page.url,
        });
    }
});
