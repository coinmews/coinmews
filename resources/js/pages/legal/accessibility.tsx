import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Head } from '@inertiajs/react';

export default function AccessibilityPage() {
    return (
        <>
            <Head>
                <title>Accessibility Statement - CoinMews</title>
                <meta name="description" content="Read the Accessibility Statement for CoinMews. Learn about our commitment to digital accessibility and the steps we take to ensure an inclusive experience for all users." />
                <meta name="keywords" content="accessibility, CoinMews, accessibility statement, WCAG, inclusive design, crypto news" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + '/legal/accessibility' : 'https://coinmews.io/legal/accessibility'} />
                <meta property="og:title" content="Accessibility Statement - CoinMews" />
                <meta property="og:description" content="Read the Accessibility Statement for CoinMews. Learn about our commitment to digital accessibility and the steps we take to ensure an inclusive experience for all users." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://coinmews.io/legal/accessibility'} />
                <meta property="og:site_name" content="CoinMews" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Accessibility Statement - CoinMews" />
                <meta name="twitter:description" content="Read the Accessibility Statement for CoinMews. Learn about our commitment to digital accessibility and the steps we take to ensure an inclusive experience for all users." />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    'name': 'Accessibility Statement - CoinMews',
                    'description': 'Read the Accessibility Statement for CoinMews. Learn about our commitment to digital accessibility and the steps we take to ensure an inclusive experience for all users.',
                    'url': typeof window !== 'undefined' ? window.location.origin + '/legal/accessibility' : 'https://coinmews.io/legal/accessibility',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io' },
                            { '@type': 'ListItem', 'position': 2, 'name': 'Accessibility Statement', 'item': typeof window !== 'undefined' ? window.location.origin + '/legal/accessibility' : 'https://coinmews.io/legal/accessibility' }
                        ]
                    }
                }) }} />
            </Head>
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
                <article className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none">
                    <h1>Accessibility Statement</h1>
                    <p className="lead">
                        CoinMews is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user
                        experience for everyone and applying the relevant accessibility standards.
                    </p>

                    <h2>Our Commitment</h2>
                    <p>
                        We strive to ensure that our website is accessible to people with disabilities. Our ongoing accessibility efforts work towards
                        conforming to WCAG 2.1 Level AA standards.
                    </p>

                    <h2>Accessibility Features</h2>
                    <p>Our website includes the following accessibility features:</p>
                    <ul>
                        <li>Keyboard navigation support</li>
                        <li>Screen reader compatibility</li>
                        <li>Text resizing without loss of functionality</li>
                        <li>Color contrast compliance</li>
                        <li>Alt text for images</li>
                        <li>ARIA landmarks and labels</li>
                        <li>Skip to main content link</li>
                        <li>Consistent navigation structure</li>
                    </ul>

                    <h2>Customization Options</h2>
                    <p>Users can customize their experience through:</p>
                    <ul>
                        <li>Dark/Light mode toggle</li>
                        <li>Browser zoom settings</li>
                        <li>Text spacing adjustments</li>
                        <li>Custom color settings through browser</li>
                    </ul>

                    <h2>Known Limitations</h2>
                    <p>While we strive for accessibility, some content may have limitations:</p>
                    <ul>
                        <li>Some older PDF documents may not be fully accessible</li>
                        <li>Some third-party content may not meet accessibility standards</li>
                        <li>Live cryptocurrency price updates may update too frequently for some screen readers</li>
                    </ul>

                    <h2>Feedback and Support</h2>
                    <p>We welcome your feedback on the accessibility of CoinMews. Please let us know if you encounter accessibility barriers:</p>
                    <ul>
                        <li>Email: accessibility@CoinMews.io</li>
                        <li>Phone: [Your Phone Number]</li>
                        <li>Feedback form: [Link to Contact Form]</li>
                    </ul>

                    <h2>Technical Specifications</h2>
                    <p>
                        Accessibility of CoinMews relies on the following technologies to work with the particular combination of web browser and any
                        assistive technologies or plugins installed on your computer:
                    </p>
                    <ul>
                        <li>HTML</li>
                        <li>WAI-ARIA</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                    </ul>

                    <h2>Assessment Approach</h2>
                    <p>CoinMews assesses the accessibility of our website through the following approaches:</p>
                    <ul>
                        <li>Self-evaluation</li>
                        <li>External accessibility evaluation</li>
                        <li>User feedback and testing</li>
                        <li>Automated testing tools</li>
                    </ul>

                    <h2>Additional Resources</h2>
                    <ul>
                        <li>Browser Accessibility Settings</li>
                        <li>Screen Reader Documentation</li>
                        <li>Web Accessibility Initiative (WAI)</li>
                    </ul>

                    <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>
                </article>
            </main>
            <Footer />
        </>
    );
}
