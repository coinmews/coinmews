import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Head } from '@inertiajs/react';

export default function CookiesPage() {
    return (
        <>
            <Head>
                <title>Cookie Policy - CoinMews</title>
                <meta name="description" content="Read the Cookie Policy for CoinMews. Learn how we use cookies and similar technologies to enhance your experience on our crypto news platform." />
                <meta name="keywords" content="cookie policy, CoinMews, cookies, privacy, crypto news" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + '/legal/cookies' : 'https://coinmews.io/legal/cookies'} />
                <meta property="og:title" content="Cookie Policy - CoinMews" />
                <meta property="og:description" content="Read the Cookie Policy for CoinMews. Learn how we use cookies and similar technologies to enhance your experience on our crypto news platform." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://coinmews.io/legal/cookies'} />
                <meta property="og:site_name" content="CoinMews" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Cookie Policy - CoinMews" />
                <meta name="twitter:description" content="Read the Cookie Policy for CoinMews. Learn how we use cookies and similar technologies to enhance your experience on our crypto news platform." />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    'name': 'Cookie Policy - CoinMews',
                    'description': 'Read the Cookie Policy for CoinMews. Learn how we use cookies and similar technologies to enhance your experience on our crypto news platform.',
                    'url': typeof window !== 'undefined' ? window.location.origin + '/legal/cookies' : 'https://coinmews.io/legal/cookies',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io' },
                            { '@type': 'ListItem', 'position': 2, 'name': 'Cookie Policy', 'item': typeof window !== 'undefined' ? window.location.origin + '/legal/cookies' : 'https://coinmews.io/legal/cookies' }
                        ]
                    }
                }) }} />
            </Head>
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
                <article className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none">
                    <h1>Cookie Policy</h1>
                    <p className="lead">
                        This Cookie Policy explains how CoinMews uses cookies and similar technologies to provide, customize, evaluate, improve,
                        promote and protect our services.
                    </p>

                    <h2>1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better
                        experience and allow certain features to work.
                    </p>

                    <h2>2. Types of Cookies We Use</h2>
                    <h3>Essential Cookies</h3>
                    <p>
                        These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access
                        to secure areas of the website.
                    </p>

                    <h3>Performance Cookies</h3>
                    <p>
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>

                    <h3>Functionality Cookies</h3>
                    <p>
                        These cookies enable the website to remember choices you make (such as your language preference or dark/light mode settings)
                        to provide enhanced features.
                    </p>

                    <h3>Targeting Cookies</h3>
                    <p>
                        These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests
                        and show you relevant content.
                    </p>

                    <h2>3. How We Use Cookies</h2>
                    <p>We use cookies to:</p>
                    <ul>
                        <li>Remember your preferences and settings</li>
                        <li>Understand how you interact with our website</li>
                        <li>Analyze and improve our website performance</li>
                        <li>Provide personalized content and recommendations</li>
                        <li>Ensure the security of our services</li>
                    </ul>

                    <h2>4. Managing Cookies</h2>
                    <p>
                        Most web browsers allow you to control cookies through their settings preferences. However, limiting or blocking cookies may
                        impact your experience of our website.
                    </p>

                    <h3>How to Control Cookies</h3>
                    <ul>
                        <li>Browser Settings: You can manage cookie preferences through your browser settings</li>
                        <li>Cookie Consent Tool: Use our cookie consent banner to manage your preferences</li>
                        <li>Third-Party Tools: You can opt out of third-party cookies using various online tools</li>
                    </ul>

                    <h2>5. Third-Party Cookies</h2>
                    <p>
                        We may use third-party services that use cookies. These third-party services have their own privacy policies and cookie
                        policies which we encourage you to review.
                    </p>

                    <h2>6. Updates to This Policy</h2>
                    <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

                    <h2>7. Contact Us</h2>
                    <p>If you have any questions about our Cookie Policy, please contact us at contact@CoinMews.io.</p>

                    <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>
                </article>
            </main>
            <Footer />
        </>
    );
}
