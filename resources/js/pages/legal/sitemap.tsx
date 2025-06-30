import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Head, Link } from '@inertiajs/react';

export default function SitemapPage() {
    const sections = [
        {
            title: 'Main Content',
            links: [
                { name: 'Home', href: '/' },
                { name: 'All Articles', href: '/articles' },
                { name: 'News', href: '/news' },
                { name: 'Blog', href: '/blog' },
                { name: 'Categories', href: '/categories' },
                { name: 'Events', href: '/events' },
            ],
        },
        {
            title: 'Categories',
            links: [
                { name: 'Blockchain', href: '/categories/blockchain' },
                { name: 'Cryptocurrency', href: '/categories/cryptocurrency' },
                { name: 'DeFi', href: '/categories/defi' },
                { name: 'NFTs', href: '/categories/nfts' },
                { name: 'Web3', href: '/categories/web3' },
                { name: 'Metaverse', href: '/categories/metaverse' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Press Kit', href: '/press' },
                { name: 'Contact', href: '/contact' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Partners', href: '/partners' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'Accessibility', href: '/accessibility' },
            ],
        },
    ];

    return (
        <>
            <Head title="Sitemap - CoinMews" />
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
                <article className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none">
                    <h1>Sitemap</h1>
                    <p className="lead">Welcome to the CoinMews sitemap. Here you can find a complete list of all pages available on our website.</p>

                    <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {sections.map((section) => (
                            <div key={section.title} className="not-prose">
                                <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <h2>XML Sitemaps</h2>
                        <p>For search engines, we also provide XML sitemaps:</p>
                        <ul>
                            <li>
                                <a href="/sitemap.xml" className="text-primary hover:text-primary/80 dark:text-primary/90 dark:hover:text-primary/70">
                                    Main Sitemap
                                </a>
                            </li>
                            <li>
                                <a href="/sitemap-news.xml" className="text-primary hover:text-primary/80 dark:text-primary/90 dark:hover:text-primary/70">
                                    News Sitemap
                                </a>
                            </li>
                        </ul>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
