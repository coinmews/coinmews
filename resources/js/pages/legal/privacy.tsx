import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Head } from '@inertiajs/react';

export default function PrivacyPage() {
    return (
        <>
            <Head>
                <title>Privacy Policy - CoinMews</title>
                <meta name="description" content="Read the Privacy Policy for CoinMews. Learn how we collect, use, and protect your personal information on our crypto news platform." />
                <meta name="keywords" content="privacy policy, CoinMews, data protection, crypto news, user privacy" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + '/legal/privacy' : 'https://coinmews.io/legal/privacy'} />
                <meta property="og:title" content="Privacy Policy - CoinMews" />
                <meta property="og:description" content="Read the Privacy Policy for CoinMews. Learn how we collect, use, and protect your personal information on our crypto news platform." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://coinmews.io/legal/privacy'} />
                <meta property="og:site_name" content="CoinMews" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Privacy Policy - CoinMews" />
                <meta name="twitter:description" content="Read the Privacy Policy for CoinMews. Learn how we collect, use, and protect your personal information on our crypto news platform." />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    'name': 'Privacy Policy - CoinMews',
                    'description': 'Read the Privacy Policy for CoinMews. Learn how we collect, use, and protect your personal information on our crypto news platform.',
                    'url': typeof window !== 'undefined' ? window.location.origin + '/legal/privacy' : 'https://coinmews.io/legal/privacy',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io' },
                            { '@type': 'ListItem', 'position': 2, 'name': 'Privacy Policy', 'item': typeof window !== 'undefined' ? window.location.origin + '/legal/privacy' : 'https://coinmews.io/legal/privacy' }
                        ]
                    }
                }) }} />
            </Head>
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
                <article className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none">
                    <h1>Privacy Policy</h1>
                    <p className="lead">
                        At CoinMews, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal
                        information.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect the following types of information:</p>
                    <ul>
                        <li>Personal information (email address, name) when you subscribe to our newsletter</li>
                        <li>Usage data (browser type, IP address, pages visited)</li>
                        <li>Cookie data for website functionality and analytics</li>
                        <li>Information you provide when contacting us</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Deliver our newsletter and updates</li>
                        <li>Improve our website and services</li>
                        <li>Analyze website traffic and user behavior</li>
                        <li>Respond to your inquiries</li>
                        <li>Ensure website security</li>
                    </ul>

                    <h2>3. Data Protection</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized
                        access, alteration, disclosure, or destruction.
                    </p>

                    <h2>4. Data Sharing</h2>
                    <p>We do not sell your personal information. We may share your data with:</p>
                    <ul>
                        <li>Service providers who assist in our operations</li>
                        <li>Analytics partners</li>
                        <li>Law enforcement when required by law</li>
                    </ul>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Object to data processing</li>
                    </ul>

                    <h2>6. Cookies</h2>
                    <p>
                        We use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences. For more
                        information, please see our Cookie Policy.
                    </p>

                    <h2>7. Third-Party Links</h2>
                    <p>
                        Our website contains links to third-party websites. We are not responsible for their privacy practices and encourage you to
                        read their privacy policies.
                    </p>

                    <h2>8. Children's Privacy</h2>
                    <p>
                        Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
                    </p>

                    <h2>9. Changes to Privacy Policy</h2>
                    <p>We may update this policy periodically. We will notify you of any material changes through our website or email.</p>

                    <h2>10. Contact Us</h2>
                    <p>For privacy-related questions or concerns, please contact us at contact@CoinMews.io.</p>

                    <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>
                </article>
            </main>
            <Footer />
        </>
    );
}
