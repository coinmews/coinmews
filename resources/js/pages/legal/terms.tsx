import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Head } from '@inertiajs/react';

export default function TermsPage() {
    return (
        <>
            <Head title="Terms of Service - CoinMews" />
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
                <article className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none">
                    <h1>Terms of Service</h1>
                    <p className="lead">
                        Welcome to CoinMews. By accessing our website and using our services, you agree to these terms of service. Please read them
                        carefully.
                    </p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using CoinMews ("we," "our," or "us"), you agree to be bound by these Terms of Service and all applicable
                        laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>

                    <h2>2. Content and Services</h2>
                    <p>
                        CoinMews provides news, information, and analysis about cryptocurrency, blockchain technology, and Web3 developments. While
                        we strive for accuracy, we do not guarantee the completeness, reliability, or accuracy of any information on our platform.
                    </p>

                    <h2>3. Not Financial Advice</h2>
                    <p>
                        The content provided on CoinMews is for informational purposes only. We do not provide financial advice, and nothing on this
                        website should be construed as financial advice. Always conduct your own research and consult with qualified financial
                        advisors before making any investment decisions.
                    </p>

                    <h2>4. User Responsibilities</h2>
                    <p>Users must:</p>
                    <ul>
                        <li>Provide accurate information when using our services</li>
                        <li>Not engage in any activity that could harm our platform or other users</li>
                        <li>Not use our platform for any illegal purposes</li>
                        <li>Respect intellectual property rights</li>
                    </ul>

                    <h2>5. Intellectual Property</h2>
                    <p>
                        All content published on CoinMews, including but not limited to text, graphics, logos, images, and software, is the property
                        of CoinMews or its content creators and protected by copyright and other intellectual property laws.
                    </p>

                    <h2>6. Third-Party Links</h2>
                    <p>
                        Our platform may contain links to third-party websites. We are not responsible for the content or practices of these websites
                        and encourage users to review their respective terms and policies.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        CoinMews shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your
                        access to or use of our platform.
                    </p>

                    <h2>8. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Users will be notified of any changes through our platform, and
                        continued use of our services constitutes acceptance of the modified terms.
                    </p>

                    <h2>9. Contact Information</h2>
                    <p>For questions about these Terms of Service, please contact us at contact@CoinMews.io.</p>

                    <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>
                </article>
            </main>
            <Footer />
        </>
    );
}
